using LearningHub.Application.Dtos.Expertises;

namespace LearningHub.Application.Dtos.Users
{
    public record UpdateUserProfileCommand
    {
        public required string FirstName {  get; init; }
        public string? LastName { get; init; }
        public decimal? CoachCost { get; init; }
        public string? Bio { get; init; }
        public string? Skills { get; init; }
        public required List<ExpertiseDto> Expertises { get; init; } = new List<ExpertiseDto>();
        public List<UpdateExperienceCommand> Experiences { get; init; } = new List<UpdateExperienceCommand>();
    }
}
