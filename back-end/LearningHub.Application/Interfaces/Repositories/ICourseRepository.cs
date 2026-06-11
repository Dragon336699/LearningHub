using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface ICourseRepository : IGenericRepository<Course>
    {
        Task<List<Course>> GetAllCourses(int page, int pageSize);
        Task<List<Course>> GetCoursesByMentor(int page, int pageSize, string keyword, Guid mentorId);
        Task<List<Course>> GetCoursesByTrainee(int page, int pageSize);
    }
}
