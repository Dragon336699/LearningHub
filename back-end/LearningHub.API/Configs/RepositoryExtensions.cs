using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Infrastructure.Repositories;
using LearningHub.Infrastructure.UnitOfWork;
namespace LearningHub.API.Configs
{
    public static class RepositoryExtensions
    {
        public static IServiceCollection AddRepositoriesAndUnitOfWork(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IExpertiseRepository, ExpertiseRepository>();
            services.AddScoped<IExperienceRepository, ExperienceRepository>();
            services.AddScoped<ICertificateRepository, CertificateRepository>();
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserAvailabilitySettingRepository, UserAvailabilitySettingRepository>();
            services.AddScoped<IAvailabilitySlotRepository, AvailabilitySlotRepository>();
            services.AddScoped<IBookingSessionRepository, BookingSessionRepository>();
            services.AddScoped<IResourceRepository, ResourceRepository>();
            services.AddScoped<IDashboardSummaryRepository, DashboardSummaryRepository>();
            services.AddScoped<ICourseTraineeRepository, CourseTraineeRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();

            return services;
        }
    }
}
