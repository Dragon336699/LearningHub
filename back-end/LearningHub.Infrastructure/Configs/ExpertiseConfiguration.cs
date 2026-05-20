using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class ExpertiseConfiguration : IEntityTypeConfiguration<Expertise>
    {
        public void Configure(EntityTypeBuilder<Expertise> builder)
        {
            builder.HasMany(ex => ex.User)
                .WithMany(u => u.Expertises);
        }
    }
}
