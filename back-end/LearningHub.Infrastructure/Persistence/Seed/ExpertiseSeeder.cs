using LearningHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningHub.Infrastructure.Persistence.Seed
{
    public class ExpertiseSeeder : IEntityTypeConfiguration<Expertise>
    {
        public void Configure(EntityTypeBuilder<Expertise> builder)
        {
            List<Expertise> expertises = CreateExpertises();
            builder.HasData(expertises);
        }

        public List<Expertise> CreateExpertises()
        {
            List<Expertise> expertises = new List<Expertise>
    {
        new Expertise
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            ExpertiseName = "Backend Development"
        },
        new Expertise
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            ExpertiseName = "Frontend Development"
        },
        new Expertise
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            ExpertiseName = "Graphic Design"
        },
        new Expertise
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            ExpertiseName = "Digital Marketing"
        },
        new Expertise
        {
            Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
            ExpertiseName = "Content Writing"
        },
        new Expertise
        {
            Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            ExpertiseName = "Photography"
        },
        new Expertise
        {
            Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
            ExpertiseName = "Video Editing"
        },
        new Expertise
        {
            Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
            ExpertiseName = "Accounting"
        },
        new Expertise
        {
            Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
            ExpertiseName = "Finance"
        },
        new Expertise
        {
            Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            ExpertiseName = "Business Analysis"
        },
        new Expertise
        {
            Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            ExpertiseName = "Project Management"
        },
        new Expertise
        {
            Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            ExpertiseName = "Human Resources"
        } };

            return expertises;
        }
    }
}
