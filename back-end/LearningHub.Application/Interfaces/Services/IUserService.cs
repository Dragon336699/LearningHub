
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task CreateUserProfile(CreateUserProfileCommand command, Guid userId);
        Task<UserDto> GetUserProfile(Guid userId);
        Task UpdateUserProfile(UpdateUserProfileCommand command, Guid userId);
    }
}
