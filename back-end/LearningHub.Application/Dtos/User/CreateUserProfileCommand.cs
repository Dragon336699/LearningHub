using LearningHub.Application.Dtos.Exterpises;

namespace LearningHub.API.Contracts.Users
{
    public record CreateUserProfileCommand
    {
        public Guid UserId { get; init; }
        public decimal? CoachCost { get; init; }
        public string? Description { get; init; }
        public required List<ExpertisesDto> Exterpises { get; init; }
        public string? Skills { get; init; }
        public List<CreateExperienceCommand>? Experiences { get; init; }
    }
}
