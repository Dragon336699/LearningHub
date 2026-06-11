using FluentValidation;
using LearningHub.Application.Common.Results;

namespace LearningHub.API.Common.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            Result<object> response;

            switch (exception)
            {
                case ValidationException ex:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    response = Result<object>.Failure(
                            ex.Errors
                                .Select(x => x.ErrorMessage)
                                .Distinct()
                                .ToList()
                        );
                    break;

                case KeyNotFoundException ex:
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    response = Result<object>.Failure([ex.Message]);
                    break;

                case UnauthorizedAccessException ex:
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    response = Result<object>.Failure([ex.Message]);
                    break;

                case IOException ex:
                    context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                    response = Result<object>.Failure([ex.Message]);
                    break;

                case Exception ex:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    response = Result<object>.Failure([ex.Message]);
                    break;

                default:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    response = Result<object>.Failure(["An unexpected error occurred"]);
                    break;
            };

            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
