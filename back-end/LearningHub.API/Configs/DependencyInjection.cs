using FluentValidation;
using LearningHub.API.Contracts.Certificates;
using LearningHub.Application.Dtos.Auth;
using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Application.Dtos.DashboardSummaries;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.Seeder;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Application.Mappers;
using LearningHub.Application.Services;
using LearningHub.Application.Validation.User;
using LearningHub.Infrastructure.BackgroundJobs;
using LearningHub.Infrastructure.Persistence.Seed;
using LearningHub.Infrastructure.Repositories;
using LearningHub.Infrastructure.Services;
using LearningHub.Infrastructure.UnitOfWork;

namespace LearningHub.API.Configs
{
    public static class DependencyInjection
    {
        public static void AddInfrastructure(this IServiceCollection services)
        {
            services.AddThirdPartyServices()
                    .AddRepositoriesAndUnitOfWork()
                    .AddApplicationServices()
                    .AddMappingServices()
                    .AddSeederService()
                    .AddFluentValidation()
                    .AddHttpContextAccessor();

        }
    }
}
