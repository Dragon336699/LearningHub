using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace LearningHub.API.Configs
{
    public static class AuthenticationServiceExtensions
    {
        public static void ConfigureAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentity<User, Role>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = true;
                options.SignIn.RequireConfirmedEmail = true;
            })
                .AddRoles<Role>()
                .AddDefaultTokenProviders()
                .AddEntityFrameworkStores<LearningHubDbContext>();
        }
    }
}
