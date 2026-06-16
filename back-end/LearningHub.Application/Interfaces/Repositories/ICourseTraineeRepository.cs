using LearningHub.Application.Dtos.Courses;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface ICourseTraineeRepository : IGenericRepository<CourseTrainee>
    {
        Task<List<Course>> GetCoursesByTraineeAsync(int page, int pageSize, Guid traineeId);
        Task<List<CourseTraineeDto>> GetEnrolledTrainees(Guid courseId);
        Task<int> GetTotalCoursesByTraineeAsync(Guid traineeId);
        Task<List<CourseTraineeDto>> GetUsersNotEnrolledInCourse(Guid courseId, string keyword);
    }
}
