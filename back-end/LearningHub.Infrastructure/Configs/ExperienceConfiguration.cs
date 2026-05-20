using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Configs
{
    public class ExperienceConfiguration : IEntityTypeConfiguration<Experience>
    {
        public void Configure(EntityTypeBuilder<Experience> builder)
        {
            builder.HasOne(exp => exp.User)
                .WithMany(u => u.Experiences)
                .HasForeignKey(exp => exp.UserId);
        }
    }
}
