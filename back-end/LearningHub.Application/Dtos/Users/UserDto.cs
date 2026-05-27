using LearningHub.Application.Dtos.Certificates;
using LearningHub.Application.Dtos.Experiences;
using LearningHub.Application.Dtos.Expertises;

namespace LearningHub.Application.Dtos.Users
{
    public class UserDto
    {
        public string? RoleName { get; set; }
        public Guid Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public decimal? CoachCost {  get; set; }
        public string? Skills { get; set; }
        public List<ExpertiseDto> Expertises { get; set; } = new List<ExpertiseDto>();
        public List<ExperienceDto> Experiences { get; set; } = new List<ExperienceDto>(); 
        public List<CertificateDto> Certificates { get; set; } = new List<CertificateDto>(); 
    }
}
