using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Services;
using LearningHub.Infrastructure.BackgroundJobs;

namespace LearningHub.API.Configs
{
    public static class ThirdPartyServicesExtensions
    {
        public static IServiceCollection AddThirdPartyServices(this IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddScoped<ICacheService, MemoryCacheService>();
            services.AddHttpClient<INotificationService, EmailService>();
            services.AddScoped<DashboardSummaryJob>();

            return services;
        }
    }
}
