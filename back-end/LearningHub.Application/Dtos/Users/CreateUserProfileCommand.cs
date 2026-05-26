using LearningHub.Application.Dtos.Common;

namespace LearningHub.Application.Dtos.Users
{
    public record CreateUserProfileCommand
    {
        public FileUploadDto? UserAvatar { get; init; }
        public decimal? CoachCost { get; init; }
        public string? Bio { get; init; }
        public string? Skills { get; init; }
        public required List<Guid> Expertises { get; init; } = new List<Guid>();
        public List<CreateExperienceCommand> Experiences { get; init; } = new List<CreateExperienceCommand>();
    }
}
