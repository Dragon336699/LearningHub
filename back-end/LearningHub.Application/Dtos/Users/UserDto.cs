using LearningHub.Application.Dtos.Certificates;
using LearningHub.Application.Dtos.Experiences;
using LearningHub.Application.Dtos.Expertises;

namespace LearningHub.Application.Dtos.Users
{
    public record UserDto
    {
        public string FirstName { get; init; } = null!;
        public string? LastName { get; init; }
        public string? Description { get; init; }
        public decimal? CoachCost {  get; init; }
        public string? Skills { get; init; }
        public List<ExpertiseDto> Expertises { get; init; } = new List<ExpertiseDto>();
        public List<ExperienceDto> Experiences { get; init; } = new List<ExperienceDto>(); 
        public List<CertificateDto> Certificates { get; init; } = new List<CertificateDto>(); 
    }
}
