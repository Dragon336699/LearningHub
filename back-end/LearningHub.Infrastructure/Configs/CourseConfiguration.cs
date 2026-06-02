using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class CourseConfiguration : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.CourseCode)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(c => c.CourseCode)
                .IsUnique();

            builder.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(c => c.LearningObjectives)
                .HasMaxLength(200);

            builder.HasOne(c => c.User)
                .WithMany(u => u.Courses)
                .HasForeignKey(c => c.UserId);
        }
    }
}
