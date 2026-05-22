namespace LearningHub.Application.Dtos.Users
{
    public record UpdateExperienceCommand
    {
        public Guid? Id { get; init; }
        public required string Title { get; init; }
        public string? Description { get; init; }
        public required DateOnly StartDate { get; init; }
        public required DateOnly EndDate { get; init; }
    }
}
