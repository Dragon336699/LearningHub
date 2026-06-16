using LearningHub.Application.Mappers;

namespace LearningHub.API.Configs
{
    public static class MappingExtensions
    {
        public static IServiceCollection AddMappingServices(this IServiceCollection services)
        {

            services.AddAutoMapper(typeof(ExperienceMappingProfile).Assembly);

            return services;
        }
    }
}
