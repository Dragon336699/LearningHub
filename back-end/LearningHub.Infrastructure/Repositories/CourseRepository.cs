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
        public async Task<List<Course>> GetCoursesByTraineeAsync(int page, int pageSize, Guid traineeId)
        {
            return await _context.Set<CourseTrainee>()
                .Where(ct => ct.TraineeId == traineeId)
                .Select(ct => ct.Course)
                .Where(c => c.Status == CourseStatus.Published)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCoursesByTraineeAsync(Guid traineeId)
        {
            return await _context.Set<CourseTrainee>()
                .Where(ct => ct.TraineeId == traineeId)
                .Select(ct => ct.Course)
                .CountAsync(c => c.Status == CourseStatus.Published);
        }

        public async Task<List<CourseTraineeDto>> GetTraineesWithEnrollmentStatusAsync(Guid courseId, string keyword)
        {

            var traineeRoleId = await _context.Roles
                .Where(r => r.Name == "Trainee")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            var query = _context.Users
                .Where(u => u.EmailConfirmed && _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == traineeRoleId));

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKeyword = keyword.Trim().ToLower();
                query = query.Where(u => u.FirstName.Contains(lowerKeyword, StringComparison.CurrentCultureIgnoreCase)
                                            || (u.LastName != null && u.LastName.Contains(lowerKeyword, StringComparison.CurrentCultureIgnoreCase)));
            }

            return await query
                .SelectMany(
                    u => u.CourseTrainees.Where(ct => ct.CourseId == courseId).DefaultIfEmpty(),
                    (u, ct) => new CourseTraineeDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName ?? string.Empty,
                        AvatarUrl = u.AvatarUrl,
                        Bio = u.Bio,
                        RoleId = traineeRoleId,
                        IsEnrolled = ct != null,
                        AssignedAt = ct != null ? ct.AssignedAt : DateTime.UtcNow,
                        Progress = ct != null ? ct.Progress : 0
                    })
                .ToListAsync();
        }

        public async Task RemoveAllCourses()
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Course");
        }
    }
}
