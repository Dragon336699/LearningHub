using FluentValidation;
using LearningHub.API.Contracts.Certificates;
using LearningHub.Application.Dtos.Auth;
using LearningHub.Application.Interfaces;
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
            services.AddMemoryCache();
            services.AddScoped<ICacheService, MemoryCacheService>();
            services.AddHttpClient<IOtpService, EmailService>();

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IExpertiseRepository, ExpertiseRepository>();
            services.AddScoped<IExperienceRepository, ExperienceRepository>();
            services.AddScoped<ICertificateRepository, CertificateRepository>();
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserAvailabilitySettingRepository, UserAvailabilitySettingRepository>();
            services.AddScoped<IAvailabilitySlotRepository, AvailabilitySlotRepository>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<ICertificateService, CertificateService>();
            services.AddScoped<IExpertiseService, ExpertiseService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IUserAvailabilityService, UserAvailabilityService>();
            services.AddScoped<ICacheService, MemoryCacheService>();

            services.AddAutoMapper(typeof(ExperienceMappingProfile).Assembly);

            services.AddScoped<IDataSeeder, RoleSeeder>();
            services.AddScoped<IDataSeeder, UserSeeder>();


            //Add DI for validation
            services.AddScoped<IValidationService, ValidationService>();
            
            //Add assembly validator project Application
            services.AddValidatorsFromAssemblyContaining<UpdateUserProfileCommandValidator>();

            //Add assembly validator project API
            services.AddValidatorsFromAssemblyContaining<CreateCertificateRequest>();
            services.AddValidatorsFromAssemblyContaining<RegisterRequest>();
            

            services.AddScoped<IDataSeeder, UserSeeder>();
        }
    }
}
