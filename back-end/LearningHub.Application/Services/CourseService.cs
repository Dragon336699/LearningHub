using AutoMapper;
using LearningHub.Application.Common.Results;
using Microsoft.EntityFrameworkCore;
using LearningHub.Application.Common;
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
                throw new Exception("No changes were saved");
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

        public async Task<Result<PagedResult<CourseDto>>> GetPagedAllCourses(int page, int pageSize)
        {
            List<Course> courses = await _unitOfWork.Courses.GetAllCourses(page, pageSize);

            int totalCourses = await _unitOfWork.Courses.GetTotalItems();

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
            keyword  = keyword?.Trim() ?? "";

            List<Course> courses = await _unitOfWork.Courses.GetCoursesByMentor(page, pageSize, keyword, mentorId);

            int totalCourses = await _unitOfWork.Courses.GetTotalItems((c) => c.UserId == mentorId && c.Title.Contains(keyword));

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

        public async Task<Result<PagedResult<CourseDto>>> GetPublishedCourses(int page, int pageSize)
        {
            List<Course> courses = await _unitOfWork.Courses.GetCoursesByTrainee(page, pageSize);

            int totalCourses = await _unitOfWork.Courses.GetTotalItems(c => c.Status == CourseStatus.Published);

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

            if (course == null)
            {
                throw new KeyNotFoundException($"Course not found.");
            }

            if (course.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this course.");
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

            if (course == null)
            {
                throw new KeyNotFoundException($"Course not found.");
            }

            if (course.Status == command.Status)
            {
                return Result<CourseDto>.Failure($"Course is already in {command.Status} status.");
            }

            course.Status = command.Status;
            course.UpdatedAt = DateTimeOffset.UtcNow;

            await _unitOfWork.CompleteAsync();

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        public async Task DeleteCourseAsync(Guid courseId, Guid userId, bool isAdmin)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(courseId);

            if (course == null)
            {
                throw new KeyNotFoundException($"Course not found.");
            }

            if (!isAdmin && course.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this course.");
            }

            _unitOfWork.Courses.Remove(course);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<Result<string>> AssignTraineesToCourseAsync(AssignTraineesCommand command)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(command.CourseId);
            if (course == null) return Result<string>.Failure("Course not found.");
            if (course.Status != CourseStatus.Published) 
            {
                return Result<string>.Failure("Cannot assign trainees to an unpublished course.");
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
            return Result<string>.Success($"Successfully assigned {command.TraineeIds.Count} trainees to the course.");
        }

        public async Task<Result<PagedResult<CourseDto>>> GetEnrolledCoursesForTraineeAsync(int page, int pageSize, Guid traineeId)
        {
            List<Course> enrolledCourses = await _unitOfWork.Courses.GetCoursesByTraineeAsync(page, pageSize, traineeId);

            int totalCourses = await _unitOfWork.Courses.GetTotalCoursesByTraineeAsync(traineeId);

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

        public async Task<Result<List<CourseTraineeDto>>> GetTraineesWithEnrollmentStatusAsync(Guid courseId, string? keyword)
        {
            if (keyword != null)
            {
                keyword = keyword.Trim().ToLower();
            }
            var allUsersWithStatus = await _unitOfWork.Courses.GetTraineesWithEnrollmentStatusAsync(courseId, keyword ?? "");

            var roles = await _unitOfWork.Roles.GetAllAsync();
            var traineeRole = roles.FirstOrDefault(r => r.Name == "Trainee");

            if (traineeRole == null) return Result<List<CourseTraineeDto>>.Success(allUsersWithStatus);

            var filteredTrainees = allUsersWithStatus.Where(u => u.RoleId == traineeRole.Id).ToList();
            return Result<List<CourseTraineeDto>>.Success(filteredTrainees);
        }
    }
    
}
