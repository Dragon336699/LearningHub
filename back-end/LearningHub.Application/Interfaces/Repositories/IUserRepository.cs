using LearningHub.Application.Dtos.Users;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<(List<User> Users, int TotalCount)> GetPagedMentors(SearchUserProfileCommand command);
    }
}
