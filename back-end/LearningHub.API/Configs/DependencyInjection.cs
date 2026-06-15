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
