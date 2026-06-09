using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IUserAvailabilitySettingRepository : IGenericRepository<UserAvailabilitySetting>
    {
        Task<List<UserAvailabilitySetting>> GetUserAvailabilities(Guid userId, DateOnly startDate, DateOnly endDate);
    }
}
