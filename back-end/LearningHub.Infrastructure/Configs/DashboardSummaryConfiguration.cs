using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Infrastructure.Configs
{
    public class DashboardSummaryConfiguration : IEntityTypeConfiguration<DashboardSummary>
    {
        public void Configure(EntityTypeBuilder<DashboardSummary> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(e => e.TotalUser).IsRequired();
            builder.Property(e => e.TotalSession).IsRequired();
            builder.Property(e => e.TotalResource).IsRequired();
            builder.Property(e => e.CreatedAt).IsRequired();

            builder.HasIndex(e => e.CreatedAt)
                  .HasDatabaseName("IX_DashboardSummary_CreatedAt");
        }
    }
}
