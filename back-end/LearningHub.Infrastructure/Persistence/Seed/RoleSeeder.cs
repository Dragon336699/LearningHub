using LearningHub.Application.Interfaces.Seeder;
using Microsoft.AspNetCore.Identity;
using LearningHub.Domain.Entities;

namespace LearningHub.Infrastructure.Persistence.Seed
{
    public class RoleSeeder : IDataSeeder
    {
        private readonly RoleManager<Role> _roleManager;

        public RoleSeeder(RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            string[] roles = { "Admin", "Mentor", "Trainee" };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new Role { Name = role });
                }
            }
        }
    }
}
