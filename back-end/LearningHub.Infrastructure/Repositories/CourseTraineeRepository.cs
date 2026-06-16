using LearningHub.Application.Dtos.Courses;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace LearningHub.Infrastructure.Repositories
{
    public class CourseTraineeRepository : GenericRepository<CourseTrainee>, ICourseTraineeRepository
    {
        public CourseTraineeRepository(LearningHubDbContext context): base(context)
        {
            
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

        public async Task<List<CourseTraineeDto>> GetUsersNotEnrolledInCourse(Guid courseId, string keyword)
        {

            var traineeRoleId = await _context.Roles
                .Where(r => r.Name == "Trainee")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            var query = _context.Users
                .Where(u => u.EmailConfirmed && _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == traineeRoleId) 
                && !_context.CourseTrainees.Any(ct => ct.CourseId == courseId && ct.TraineeId == u.Id));

            if (!string.IsNullOrEmpty(keyword))
            {
                var lowerKeyword = keyword.Trim().ToLower();
                query = query.Where(u => (u.FirstName + " " + u.LastName).Contains(keyword));
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
                        IsEnrolled = false,
                        AssignedAt = null,
                        Progress = 0
                    })
                .ToListAsync();
        }

        public async Task<List<CourseTraineeDto>> GetEnrolledTrainees(Guid courseId)
        {

            var traineeRoleId = await _context.Roles
                .Where(r => r.Name == "Trainee")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            var query = _context.Users
                .Where(u => u.EmailConfirmed && _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == traineeRoleId)
                && _context.CourseTrainees.Any(ct => ct.CourseId == courseId && ct.TraineeId == u.Id));

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
    }
}
