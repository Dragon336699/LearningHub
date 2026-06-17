using AutoMapper;
using LearningHub.Application.Common.Constants;
using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;

namespace LearningHub.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public CourseService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<CourseDto>> CreateNewCourseAsync(CreateCourseCommand command, Guid userId)
        {
            CreateCourseCommand commandNormalized = command.Normalize();
            Course course = _mapper.Map<Course>(commandNormalized);
            course.UserId = userId;
            string courseCode = await CreateCourseCode();
            course.CourseCode = courseCode;

            await _unitOfWork.Courses.AddAsync(course);
            int rowAffected = await _unitOfWork.CompleteAsync();

            if (rowAffected == 0)
            {
                throw new Exception(Messages.CourseMessage.NoChangesSaved);
            }

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        private async Task<string> CreateCourseCode()
        {
            string code;
            do
            {
                code = $"CRS_{GenerateRandomString()}";
            } while (await _unitOfWork.Courses.FirstOrDefaultAsync(c => c.CourseCode == code) != null);

            return code;
        }

        private string GenerateRandomString(int length = 6)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Range(0, length).Select(_ => chars[Random.Shared.Next(chars.Length)]).ToArray());
        }

        public async Task<Result<PagedResult<CourseDto>>> GetPagedAllCourses(int page, int pageSize, string? keyword)
        {
            keyword = keyword?.Trim().ToLower() ?? "";

            var (courses, totalCourses) = await _unitOfWork.Courses.GetAllCourses(page, pageSize, keyword);

            List<CourseDto> coursesDto = _mapper.Map<List<CourseDto>>(courses);

            PagedResult<CourseDto> pageCourses = new PagedResult<CourseDto>
            {
                Items = coursesDto,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCourses
            };

            return Result<PagedResult<CourseDto>>.Success(pageCourses);
        }

        public async Task<Result<PagedResult<CourseDto>>> GetCoursesByMentor(int page, int pageSize, string? keyword, Guid mentorId)
        {
            keyword = keyword?.Trim().ToLower() ?? "";

            var (courses, totalCourses) = await _unitOfWork.Courses.GetCoursesByMentor(page, pageSize, keyword, mentorId);

            List<CourseDto> coursesDto = _mapper.Map<List<CourseDto>>(courses);

            PagedResult<CourseDto> pageCourses = new PagedResult<CourseDto>
            {
                Items = coursesDto,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCourses
            };

            return Result<PagedResult<CourseDto>>.Success(pageCourses);
        }

        public async Task<Result<PagedResult<CourseDto>>> GetPublishedCourses(int page, int pageSize, string? keyword)
        {
            keyword = keyword?.Trim().ToLower() ?? "";

            var (courses, totalCourses) = await _unitOfWork.Courses.GetCoursesByTrainee(page, pageSize, keyword);

            List<CourseDto> coursesDto = _mapper.Map<List<CourseDto>>(courses);

            PagedResult<CourseDto> pageCourses = new PagedResult<CourseDto>
            {
                Items = coursesDto,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCourses
            };

            return Result<PagedResult<CourseDto>>.Success(pageCourses);
        }

        public async Task<Result<CourseDto>> UpdateCourseAsync(UpdateCourseCommand command, Guid userId)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(command.Id);

            ValidateCourse(course);

            if (course.UserId != userId)
            {
                throw new UnauthorizedAccessException(Messages.CourseMessage.NotAuthorizedToUpdate);
            }

            course.Title = command.Title.Trim();
            course.Description = command.Description.Trim();
            course.LearningObjectives = command.LearningObjectives?.Trim();
            course.UpdatedAt = DateTimeOffset.UtcNow;

            await _unitOfWork.CompleteAsync();

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        public async Task<Result<CourseDto>> UpdateCourseStatusAsync(UpdateCourseStatusCommand command)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(command.Id);

            ValidateCourse(course);

            CourseTrainee? courseTrainee = await _unitOfWork.CourseTrainees.FirstOrDefaultAsync(ct => ct.CourseId == course.Id);

            if (courseTrainee != null)
            {
                throw new Exception(Messages.CourseMessage.FailToChangeToDraft);
            }

            if (course.Status == command.Status)
            {
                return Result<CourseDto>.Failure(string.Format(Messages.CourseMessage.AlreadyInStatus, command.Status));
            }

            course.Status = command.Status;
            course.UpdatedAt = DateTimeOffset.UtcNow;

            await _unitOfWork.CompleteAsync();

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        public async Task DeleteCourseAsync(Guid courseId, Guid userId, bool isAdmin)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(courseId);

            ValidateCourse(course);

            if (!isAdmin && course.UserId != userId)
            {
                throw new UnauthorizedAccessException(Messages.CourseMessage.NotAuthorizedToDelete);
            }

            _unitOfWork.Courses.Remove(course);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<Result<string>> AssignTraineesToCourseAsync(AssignTraineesCommand command)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(command.CourseId);

            ValidateCourse(course);

            if (course.Status != CourseStatus.Published)
            {
                return Result<string>.Failure(Messages.CourseMessage.FailToAssignToUnpublish);
            }

            foreach (var traineeId in command.TraineeIds)
            {
                var existingEnrollment = await _unitOfWork.CourseTrainees
                    .FirstOrDefaultAsync(ct => ct.CourseId == command.CourseId && ct.TraineeId == traineeId);

                if (existingEnrollment == null)
                {
                    var enrollment = new CourseTrainee
                    {
                        CourseId = command.CourseId,
                        TraineeId = traineeId,
                        AssignedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.CourseTrainees.AddAsync(enrollment);
                }
            }

            await _unitOfWork.CompleteAsync();
            return Result<string>.Success(string.Format(Messages.CourseMessage.SuccesfullyAssignTrainee, command.TraineeIds.Count()));
        }

        public async Task<Result<PagedResult<CourseDto>>> GetEnrolledCoursesForTraineeAsync(int page, int pageSize, Guid traineeId)
        {
            List<Course> enrolledCourses = await _unitOfWork.CourseTrainees.GetCoursesByTraineeAsync(page, pageSize, traineeId);

            int totalCourses = await _unitOfWork.CourseTrainees.GetTotalCoursesByTraineeAsync(traineeId);

            List<CourseDto> coursesDto = _mapper.Map<List<CourseDto>>(enrolledCourses);

            PagedResult<CourseDto> pageCourses = new PagedResult<CourseDto>
            {
                Items = coursesDto,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCourses
            };

            return Result<PagedResult<CourseDto>>.Success(pageCourses);
        }

        public async Task<Result<List<CourseTraineeDto>>> GetUsersNotEnrolledInCourseAsync(Guid courseId, string? keyword)
        {
            string searchKeyword = keyword?.ToLower().Trim() ?? string.Empty;

            var traineesWithStatus = await _unitOfWork.CourseTrainees.GetUsersNotEnrolledInCourseAsync(courseId, searchKeyword);

            return Result<List<CourseTraineeDto>>.Success(traineesWithStatus);
        }

        public async Task<Result<List<CourseTraineeDto>>> GetEnrolledTraineesAsync(Guid courseId)
        {
            var traineesWithStatus = await _unitOfWork.CourseTrainees.GetEnrolledTrainees(courseId);

            return Result<List<CourseTraineeDto>>.Success(traineesWithStatus);
        }
        public async Task CleanupCourses()
        {
            await _unitOfWork.Courses.RemoveAllCourses();
            await _unitOfWork.CompleteAsync();
        }

        private void ValidateCourse(Course? course)
        {
            if (course == null)
            {
                throw new KeyNotFoundException(Messages.CourseMessage.CourseNotFound);
            }
        }
    }

}
