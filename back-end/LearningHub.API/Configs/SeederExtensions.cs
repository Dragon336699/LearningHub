using LearningHub.Application.Interfaces.Seeder;
using LearningHub.Infrastructure.Persistence.Seed;

namespace LearningHub.API.Configs
{
    public static class SeederExtensions
    {
        public static IServiceCollection AddSeederService(this IServiceCollection services)
        {

            services.AddScoped<IDataSeeder, RoleSeeder>();
            services.AddScoped<IDataSeeder, UserSeeder>();
            services.AddScoped<IDataSeeder, DashboardSummarySeeder>();

            return services;
        }
    }
}
