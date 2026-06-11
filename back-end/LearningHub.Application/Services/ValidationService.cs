using FluentValidation;
using LearningHub.Application.Common.Results;
using LearningHub.Application.Interfaces.Services;

namespace LearningHub.Application.Services
{
    public class ValidationService : IValidationService
    {
        private readonly IServiceProvider _serviceProvider;
        public ValidationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task<Result<T>> ValidateAsync<T>(T request) where T : class
        {
            var validator = _serviceProvider.GetService(typeof(IValidator<T>)) as IValidator<T>;

            if (validator == null) return Result<T>.Success();

            var validationResult = await validator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .Distinct()
                    .ToList();
                return Result<T>.Failure(errors);
            }

            return Result<T>.Success();
        }
    }
}
