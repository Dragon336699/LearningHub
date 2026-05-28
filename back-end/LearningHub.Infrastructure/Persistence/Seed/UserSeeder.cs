using LearningHub.Application.Interfaces.Seeder;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using LearningHub.Infrastructure.Data; 

namespace LearningHub.Infrastructure.Persistence.Seed
{
    public class UserSeeder : IDataSeeder
    {
        private readonly UserManager<User> _userManager;
        private readonly LearningHubDbContext _context;

        public UserSeeder(UserManager<User> userManager, LearningHubDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task SeedAsync()
        {
            if (await _userManager.Users.AnyAsync()) return;

            var backendEx = await _context.Set<Expertise>().FirstOrDefaultAsync(e => e.Id == Guid.Parse("11111111-1111-1111-1111-111111111111"));
            var frontendEx = await _context.Set<Expertise>().FirstOrDefaultAsync(e => e.Id == Guid.Parse("22222222-2222-2222-2222-222222222222"));

            var admin = new User
            {
                Id = Guid.CreateVersion7(),
                UserName = "admin@learninghub.com",
                Email = "admin@learninghub.com",
                FirstName = "System",
                LastName = "Admin",
                EmailConfirmed = true, 
                Status = UserStatus.Active
            };

            var createAdminResult = await _userManager.CreateAsync(admin, "Admin@123");
            if (!createAdminResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(admin, "Admin");
            }

            var mentorId = Guid.CreateVersion7();
            var mentor = new User
            {
                Id = mentorId,
                UserName = "mentor.nam@learninghub.com",
                Email = "mentor.nam@learninghub.com",
                FirstName = "Nam",
                LastName = "Nguyen",
                CoachCost = 500000,
                Bio = "Backend engineer",
                Skills = "C#, .NET Core, SQL Server, Docker",
                EmailConfirmed = true,
                Status = UserStatus.Active,

                Experiences = new List<Experience>
                {
                    new Experience
                    {
                        Title = "Senior Backend Engineer",
                        Description = "Develop Microservices System",
                        StartDate = new DateOnly(2022, 1, 1),
                        EndDate = new DateOnly(2025, 12, 31)
                    }
                },

                Certificates = new List<Certificate>
                {
                    new Certificate
                    {
                        CertificateName = "Microsoft Certified: Azure Solutions Architect",
                        Organization = "Microsoft",
                        IssueDate = new DateOnly(2024, 5, 15)
                    }
                },

                Expertises = new List<Expertise>()
            };

            if (backendEx != null) mentor.Expertises.Add(backendEx);

            var createMentorResult = await _userManager.CreateAsync(mentor, "Mentor@123");
            if (createMentorResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(mentor, "Mentor");
            }
            
            var trainee = new User
            {
                Id = Guid.CreateVersion7(),
                UserName = "trainee.hoa@learninghub.com",
                Email = "trainee.hoa@learninghub.com",
                FirstName = "Hoa",
                LastName = "Tran",
                Bio = "Final year student",
                EmailConfirmed = true,
                Status = UserStatus.Active,
                Expertises = new List<Expertise>()
            };

            if (frontendEx != null) trainee.Expertises.Add(frontendEx);

            var createTraineeResult = await _userManager.CreateAsync(trainee, "Trainee@123");
            if (createTraineeResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(trainee, "Trainee");
            }
        }
    }
}