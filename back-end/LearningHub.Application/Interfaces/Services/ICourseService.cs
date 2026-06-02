using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Courses;

namespace LearningHub.Application.Interfaces.Services
{
    public interface ICourseService
    {
        Task<Result<CourseDto>> CreateNewCourseAsync(CreateCourseCommand command, Guid userId);
        Task<Result<PagedResult<CourseDto>>> GetPagedAllCourses(int page, int pageSize);
        Task<Result<PagedResult<CourseDto>>> GetCoursesByMentor(int page, int pageSize, Guid userId);
        Task<Result<PagedResult<CourseDto>>> GetPublishedCourses(int page, int pageSize);
        Task<Result<CourseDto>> UpdateCourseAsync(UpdateCourseCommand command, Guid userId);
        Task<Result<CourseDto>> UpdateCourseStatusAsync(UpdateCourseStatusCommand command);
        Task DeleteCourseAsync(Guid courseId, Guid userId, bool isAdmin);
    }
}
