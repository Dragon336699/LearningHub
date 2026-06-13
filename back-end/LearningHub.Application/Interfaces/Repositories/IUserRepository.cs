using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<List<User>> GetMentorsByIdsAsync(IEnumerable<Guid> ids);
        Task<int> Count();
    }
}
