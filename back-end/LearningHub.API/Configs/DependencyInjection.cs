using FluentValidation;
using LearningHub.API.Contracts.Certificates;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.Seeder;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Application.Mappers;
using LearningHub.Application.Services;
using LearningHub.Application.Validation.User;
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
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IExpertiseRepository, ExpertiseRepository>();
            services.AddScoped<IExperienceRepository, ExperienceRepository>();
            services.AddScoped<ICertificateRepository, CertificateRepository>();
            services.AddScoped<ICourseRepository, CourseRepository>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICertificateService, CertificateService>();
            services.AddScoped<IExpertiseService, ExpertiseService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<ICourseService, CourseService>();

            services.AddAutoMapper(typeof(ExperienceMappingProfile).Assembly);

            services.AddScoped<IDataSeeder, RoleSeeder>();


            //Add DI for validation
            services.AddScoped<IValidationService, ValidationService>();
            
            //Add assembly validator project Application
            services.AddValidatorsFromAssemblyContaining<UpdateUserProfileCommandValidator>();

            //Add assembly validator project API
            services.AddValidatorsFromAssemblyContaining<CreateCertificateRequest>();
            services.AddScoped<IDataSeeder, UserSeeder>();
        }
    }
}
