using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Services
{
    public interface ICourseService
    {
        Task<Result<CourseDto>> CreateNewCourseAsync(CreateCourseCommand command, Guid userId);
        Task<Result<PagedResult<CourseDto>>> GetPagedAllCourses(int page, int pageSize);
        Task<Result<PagedResult<CourseDto>>> GetCoursesByMentor(int page, int pageSize, string? keyword, Guid userId);
        Task<Result<PagedResult<CourseDto>>> GetPublishedCourses(int page, int pageSize);
        Task<Result<PagedResult<CourseDto>>> GetEnrolledCoursesForTraineeAsync(int page, int pageSize, Guid traineeId);
        Task<Result<CourseDto>> UpdateCourseAsync(UpdateCourseCommand command, Guid userId);
        Task<Result<CourseDto>> UpdateCourseStatusAsync(UpdateCourseStatusCommand command);
        Task DeleteCourseAsync(Guid courseId, Guid userId, bool isAdmin);
        Task<Result<string>> AssignTraineesToCourseAsync(AssignTraineesCommand command);
        Task<Result<List<CourseTraineeDto>>> GetTraineesWithEnrollmentStatusAsync(Guid courseId, string? keyword);
    }
}
