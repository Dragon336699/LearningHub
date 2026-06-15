using AutoMapper;
using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using System.Runtime.CompilerServices;

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
            keyword  = keyword?.Trim().ToLower() ?? "";

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

        public async Task CleanupCourses()
        {
            await _unitOfWork.Courses.RemoveAllCourses();
            await _unitOfWork.CompleteAsync();
        }
    }
}
