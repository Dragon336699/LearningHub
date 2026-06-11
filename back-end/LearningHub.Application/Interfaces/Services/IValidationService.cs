using LearningHub.Application.Common.Results;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IValidationService
    {
        Task<Result<T>> ValidateAsync<T>(T request) where T : class;
    }
}
