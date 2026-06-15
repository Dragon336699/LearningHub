using LearningHub.Domain.Entities;
using Microsoft.AspNetCore.Identity;
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
        public DbSet<BookingSession> BookingSessions { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<UserAvailabilitySetting> UserAvailabilitySettings { get; set; }
        public DbSet<AvailabilitySlot> AvailabilitySlots { get; set; }
        public DbSet<CourseTrainee> CourseTrainees { get; set; }
        public DbSet<DashboardSummary> DashboardSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(typeof(LearningHubDbContext).Assembly);
            base.OnModelCreating(builder);
        }
    }
}
