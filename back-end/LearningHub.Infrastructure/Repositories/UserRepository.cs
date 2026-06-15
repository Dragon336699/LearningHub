using LearningHub.Application.Dtos.Users;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(LearningHubDbContext context): base(context)
        {
            
        }

        public async Task<(List<User> Users, int TotalCount)> GetPagedMentors(SearchUserProfileCommand command)
        {
            var lowerCaseKeyword = command.Keyword.Trim().ToLower();
            var query =
                from user in _context.Users
                join userRole in _context.UserRoles on user.Id equals userRole.UserId
                join role in _context.Roles on userRole.RoleId equals role.Id
                where role.Name == "Mentor" && user.Status == UserStatus.Active
                && !string.IsNullOrEmpty(user.FirstName)
                && (user.FirstName.ToLower().Contains(command.Keyword.Trim().ToLower()) || (user.LastName != null && user.LastName.ToLower().Contains(lowerCaseKeyword)))
                select user;

            if (command.ExpertiseIds.Any())
            {
                query = query.Where(u => u.Expertises.Any(e => command.ExpertiseIds.Contains(e.Id)));
            }

            List<User> users = await query
                .Include(u => u.Expertises)
                .Skip((command.Page - 1) * command.PageSize)
                .Take(command.PageSize)
                .ToListAsync();

            int totalCount = await query.CountAsync();

            return (users, totalCount);
        }
        public async Task<int> Count()
        {
            return await _context.Users
                .AsNoTracking()
                .CountAsync(u => u.Status == UserStatus.Active);
        }

    }
}
