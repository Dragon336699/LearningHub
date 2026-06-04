using LearningHub.Application.Common;
using LearningHub.Application.Dtos.UserAvailabilities;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IUserAvailabilityService
    {
        Task<Result<List<UserAvailabilityDto>>> CreateUserAvailabilities(List<CreateUserAvailabilityCommand> command, Guid userId);
        Task<Result<List<UserAvailabilityDto>>> GetUserAvailabilities(Guid userId);
    }
}
