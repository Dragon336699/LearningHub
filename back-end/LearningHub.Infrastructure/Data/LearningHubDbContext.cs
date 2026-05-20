using LearningHub.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Data
{
    public class LearningHubDbContext : IdentityDbContext<User, Role, Guid>
    {
        public LearningHubDbContext(DbContextOptions<LearningHubDbContext> options): base(options)
        {
            
        }

        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Expertise> Expertises { get; set; }
        public DbSet<Certificate> Certificates { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(typeof(LearningHubDbContext).Assembly);
            base.OnModelCreating(builder);
        }
    }
}
