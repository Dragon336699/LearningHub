using LearningHub.Application.Dtos.Courses;
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

        public async Task<(List<Course> courses, int totalItems)> GetAllCourses(int page, int pageSize, string keyword)
        {
            var query = _context.Set<Course>()
                .Where(c => c.CourseCode.ToLower().Contains(keyword) || c.Title.ToLower().Contains(keyword))
                .OrderByDescending(c => c.UpdatedAt);

            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var totalItems = await query.CountAsync();

            return (courses, totalItems);
        }

        public async Task<(List<Course> courses, int totalItems)> GetCoursesByMentor(int page, int pageSize, string keyword, Guid mentorId)
        {
            var query = _context.Set<Course>()
                .Where(c => c.UserId == mentorId && (c.CourseCode.ToLower().Contains(keyword) || c.Title.ToLower().Contains(keyword)))
                .OrderByDescending(c => c.UpdatedAt);

            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var totalItems = await query.CountAsync();

            return (courses, totalItems);
        }

        public async Task<(List<Course> courses, int totalItems)> GetCoursesByTrainee(int page, int pageSize, string keyword)
        {
            var query = _context.Set<Course>()
                .Where(c => c.Status == CourseStatus.Published && (c.CourseCode.ToLower().Contains(keyword) || c.Title.ToLower().Contains(keyword)))
                .OrderByDescending(c => c.UpdatedAt);

            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var totalItems = await query.CountAsync();

            return (courses, totalItems);
        }

        public async Task RemoveAllCourses()
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Course");
        }
    }
}
