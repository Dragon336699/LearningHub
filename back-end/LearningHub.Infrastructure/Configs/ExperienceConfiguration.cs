using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class ExperienceConfiguration : IEntityTypeConfiguration<Experience>
    {
        public void Configure(EntityTypeBuilder<Experience> builder)
        {
            builder.HasKey(exp => exp.Id);

            builder.Property(exp => exp.Title)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(exp => exp.Description)
                .HasMaxLength(500);

            builder.HasOne(exp => exp.User)
                .WithMany(u => u.Experiences)
                .HasForeignKey(exp => exp.UserId);
        }
    }
}
