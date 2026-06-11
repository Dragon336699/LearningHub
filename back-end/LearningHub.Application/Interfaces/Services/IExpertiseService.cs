using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Expertises;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IExpertiseService
    {
        Task<Result<List<ExpertiseDto>>> GetAllExpertisesAsync();
    }
}
