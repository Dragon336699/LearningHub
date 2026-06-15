using LearningHub.Application.Common.Results;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IResourceRepository : IGenericRepository<Resource>
    {
        Task<PagedResult<Resource>> GetPagedResourcesByTrainee(int page, int pageSize, string keyword, Guid traineeId);
        Task<PagedResult<Resource>> GetPagedResourcesByMentor(int page, int pageSize, string keyword, Guid userId);
    }
}
