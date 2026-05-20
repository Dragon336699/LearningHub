using LearningHub.API.Common.Responses;
using FluentValidation;

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
            var response = new ErrorResponse();


            switch (exception)
            {
                case ValidationException ex:
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Message = "Validation failed";
                    response.Errors = ex.Errors.Select(x => x.ErrorMessage).ToList();
                    break;

                case KeyNotFoundException ex:
                    response.StatusCode = StatusCodes.Status404NotFound;
                    response.Message = ex.Message;
                    break;

                case UnauthorizedAccessException ex:
                    response.StatusCode = StatusCodes.Status401Unauthorized;
                    response.Message = ex.Message;
                    break;

                default:
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    response.Message = "An unexpected error occurred.";
                    break;
            };

            context.Response.StatusCode = response.StatusCode;

            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
