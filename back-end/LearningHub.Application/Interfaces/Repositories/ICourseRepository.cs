using LearningHub.Application.Dtos.Courses;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface ICourseRepository : IGenericRepository<Course>
    {
        Task RemoveAllCourses();
        Task<(List<Course> courses, int totalItems)> GetAllCourses(int page, int pageSize, string keyword);
        Task<(List<Course> courses, int totalItems)> GetCoursesByMentor(int page, int pageSize, string keyword, Guid mentorId);
        Task<(List<Course> courses, int totalItems)> GetCoursesByTrainee(int page, int pageSize, string keyword);
    }
}
