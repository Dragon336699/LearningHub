namespace LearningHub.Application.Dtos.Exterpises
{
    public record ExpertisesDto
    {
        public Guid Id { get; init; }
        public string ExpertiseName { get; init; } = null!;
    }
}
