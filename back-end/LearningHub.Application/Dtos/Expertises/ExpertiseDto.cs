namespace LearningHub.Application.Dtos.Expertises
{
    public record ExpertiseDto
    {
        public Guid Id { get; init; }
        public string ExpertiseName { get; init; } = null!;
    }
}
