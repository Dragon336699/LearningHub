using LearningHub.Application.Dtos.Expertises;

namespace LearningHub.Application.Dtos.Users
{
    public record CreateUserProfileCommand
    {
        public decimal? CoachCost { get; init; }
        public string? Description { get; init; }
        public required List<ExpertiseDto> Expertises { get; init; }
        public string? Skills { get; init; }
        public List<CreateExperienceCommand>? Experiences { get; init; }
    }
}
