using FluentValidation;
using LearningHub.API.Contracts.Certificates;
using LearningHub.Application.Dtos.Auth;
using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Application.Dtos.DashboardSummaries;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Services;
using LearningHub.Application.Validation.User;

namespace LearningHub.API.Configs
{
    public static class ValidationExtensions
    {
        public static IServiceCollection AddFluentValidation(this IServiceCollection services)
        {
            services.AddScoped<IValidationService, ValidationService>();

            //application
            services.AddValidatorsFromAssemblyContaining<UpdateUserProfileCommandValidator>();

            //api
            services.AddValidatorsFromAssemblyContaining<CreateCertificateRequest>();
            services.AddValidatorsFromAssemblyContaining<RegisterRequest>();
            services.AddValidatorsFromAssemblyContaining<CreateBookingSessionRequest>();
            services.AddValidatorsFromAssemblyContaining<AvailableSlotsRequest>();
            services.AddValidatorsFromAssemblyContaining<GetSessionsRequest>();
            services.AddValidatorsFromAssemblyContaining<GetDashboardSummaryRequest>();

            return services;
        }
    }
}
