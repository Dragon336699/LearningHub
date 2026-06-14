using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class CourseTraineeConfiguration : IEntityTypeConfiguration<CourseTrainee>
    {
        public void Configure(EntityTypeBuilder<CourseTrainee> builder)
        {
            builder.HasKey(ct => new { ct.CourseId, ct.TraineeId });

            builder.HasOne(ct => ct.Course)
                .WithMany(c => c.CourseTrainees)
                .HasForeignKey(ct => ct.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ct => ct.Trainee)
                .WithMany(t => t.CourseTrainees)
                .HasForeignKey(ct => ct.TraineeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}