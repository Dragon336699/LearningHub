using LearningHub.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace LearningHub.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public decimal? CoachCost { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public string? Skills { get; set; }
        public UserStatus Status { get; set; } = UserStatus.Active;
        public ICollection<Experience> Experiences { get; set; } = new List<Experience>();
        public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
        public ICollection<Expertise> Expertises { get; set; } = new List<Expertise>();
    }
}
