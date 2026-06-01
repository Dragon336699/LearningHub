using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Repositories
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        public CourseRepository(LearningHubDbContext context): base(context)
        {
            
        }

        public async Task<List<Course>> GetAllCourses(int page, int pageSize)
        {
            return await _context.Set<Course>()
                .OrderByDescending(c => c.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Course>> GetCoursesByMentor(int page, int pageSize, Guid mentorId)
        {
            return await _context.Set<Course>()
                .Where(c => c.UserId == mentorId)
                .OrderByDescending(c => c.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Course>> GetCoursesByTrainee(int page, int pageSize)
        {
            return await _context.Set<Course>()
                .Where(c => c.Status == CourseStatus.Published)
                .OrderByDescending(c => c.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}
