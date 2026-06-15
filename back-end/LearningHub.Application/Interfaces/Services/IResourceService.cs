using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Resources;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IResourceService
    {
        Task<Result<ResourceDto>> CreateResourceAsync(CreateResourceCommand command);
        Task<Result<PagedResult<ResourceDto>>> GetResourcesAsync(int page, int pageSize, string? keyword);
        Task<Result<PagedResult<ResourceDto>>> GetResourcesByMentor(int page = 1, int pageSize = 10, string? keyword = "");
        Task<Result<ResourceDto>> UpdateResourceAsync(UpdateResourceCommand command);
        Task DeleteResourceAsync(Guid resourceId);
    }
}
