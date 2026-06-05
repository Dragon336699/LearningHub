using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using System.Text;

namespace LearningHub.Infrastructure.Configs
{
    public class BookingSessionConfiguration : IEntityTypeConfiguration<BookingSession>
    {
        public void Configure(EntityTypeBuilder<BookingSession> builder)
        {
            builder.HasOne(b => b.Mentor)
            .WithMany()
            .HasForeignKey(b => b.MentorId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(b => b.Trainee)
                .WithMany()
                .HasForeignKey(b => b.TraineeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
