using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Services;
using LearningHub.Infrastructure.Services;
namespace LearningHub.API.Configs
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<ICertificateService, CertificateService>();
            services.AddScoped<IExpertiseService, ExpertiseService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IUserAvailabilityService, UserAvailabilityService>();
            services.AddScoped<ICacheService, MemoryCacheService>();
            services.AddScoped<IBookingSessionService, BookingSessionService>();
            services.AddScoped<IResourceService, ResourceService>();
            services.AddScoped<ICurrentSessionService, CurrentSessionService>();
            services.AddScoped<IDashboardSummaryService, DashboardSummaryService>();

            return services;
        }
    }
}
