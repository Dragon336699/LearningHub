using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.LastName)
                .HasMaxLength(50);

            builder.Property(u => u.CoachCost)
                .HasPrecision(18, 2);

            builder.Property(u => u.AvatarUrl)
                .HasMaxLength(2048);

            builder.Property(u => u.Bio)
                .HasMaxLength(500);

            builder.Property(u => u.Skills)
                .HasMaxLength(500);

            builder.HasMany(u => u.Experiences)
                .WithOne(exp => exp.User)
                .HasForeignKey(exp => exp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Certificates)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Courses)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Expertises)
                .WithMany(e => e.Users);
        }
    }
}
