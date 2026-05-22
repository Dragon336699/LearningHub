namespace LearningHub.Application.Dtos.Experiences
{
    public record ExperienceDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; } = null!;
        public string? Description { get; init; }
        public DateOnly StartDate {  get; init; }
        public DateOnly EndDate { get; init; }
    }
}
