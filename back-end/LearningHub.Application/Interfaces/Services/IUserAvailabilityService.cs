using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.UserAvailabilities;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IUserAvailabilityService
    {
        Task<Result<List<UserAvailabilityDto>>> CreateUserAvailabilities(List<CreateUserAvailabilitySettingCommand> command, Guid userId);
        Task<Result<List<UserAvailabilityDto>>> GetUserAvailabilities(Guid userId, GetUserAvailabilitiesQuery query);
    }
}
