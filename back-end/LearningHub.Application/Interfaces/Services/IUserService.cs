using LearningHub.API.Contracts.Users;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task CreateUserProfile(CreateUserProfileCommand command);
    }
}
