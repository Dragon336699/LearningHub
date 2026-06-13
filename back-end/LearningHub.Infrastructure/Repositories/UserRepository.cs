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

        public async Task<List<User>> GetMentorsByIdsAsync(IEnumerable<Guid> ids)
        {
            return await _context
                .Set<User>()
                .Where(u => ids.Contains(u.Id) && u.Status == UserStatus.Active && !string.IsNullOrEmpty(u.FirstName))
                .Include(u => u.Expertises)
                .ToListAsync();
        }

        public async Task<int> Count()
        {
            return await _context.Users
                .AsNoTracking()
                .CountAsync(u => u.Status == UserStatus.Active);
        }

    }
}
