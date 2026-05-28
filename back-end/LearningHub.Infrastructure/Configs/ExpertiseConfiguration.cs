using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class ExpertiseConfiguration : IEntityTypeConfiguration<Expertise>
    {
        public void Configure(EntityTypeBuilder<Expertise> builder)
        {
            builder.HasKey(ex => ex.Id);

            builder.Property(ex => ex.ExpertiseName)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasMany(ex => ex.Users)
                .WithMany(u => u.Expertises);
        }
    }
}
