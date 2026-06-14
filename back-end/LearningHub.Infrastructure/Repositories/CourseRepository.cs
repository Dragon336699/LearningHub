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

        public async Task<List<Course>> GetAllCourses(int page, int pageSize)
        {
            return await _context.Set<Course>()
                .OrderByDescending(c => c.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Course>> GetCoursesByMentor(int page, int pageSize, string keyword, Guid mentorId)
        {
            return await _context.Set<Course>()
                .Where(c => c.UserId == mentorId && c.Title.Contains(keyword))
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

        public async Task<List<CourseTraineeDto>> GetTraineesWithEnrollmentStatusAsync(Guid courseId)
        {
            var enrolledTraineeIds = await _context.Set<CourseTrainee>()
                .Where(ct => ct.CourseId == courseId)
                .Select(ct => ct.TraineeId)
                .ToListAsync();

            var traineeRoleId = await _context.Roles
                .Where(r => r.Name == "Trainee")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            var traineeUsers = await _context.Users
                .Where(u => u.EmailConfirmed && _context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == traineeRoleId))
                .ToListAsync();

            return traineeUsers.Select(u => new CourseTraineeDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName ?? string.Empty,
                AvatarUrl = u.AvatarUrl,
                Bio = u.Bio,
                
                RoleId = traineeRoleId, 
                
                IsEnrolled = enrolledTraineeIds.Contains(u.Id),
                TrainingStatus = "Incomplete"
            }).ToList();
        }
    }
}
