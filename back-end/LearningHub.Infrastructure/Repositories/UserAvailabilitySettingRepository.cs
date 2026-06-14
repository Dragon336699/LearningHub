using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Repositories
{
    public class UserAvailabilitySettingRepository : GenericRepository<UserAvailabilitySetting>, IUserAvailabilitySettingRepository
    {
        public UserAvailabilitySettingRepository(LearningHubDbContext context): base(context)
        {
            
        }

        public async Task<List<UserAvailabilitySetting>> GetUserAvailabilities(Guid userId, DateOnly startDate, DateOnly endDate)
        {
            var query = _context.Set<UserAvailabilitySetting>();

            var userAvailabilities = await query
                .Where(ua => ua.UserId == userId && ua.SettingDay >= startDate && ua.SettingDay <= endDate)
                .Include(u => u.AvailabilitySlots.OrderBy(s => s.StartTime))
                .ToListAsync();
            return userAvailabilities;
        }
    }
}
