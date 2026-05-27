namespace LearningHub.Application.Dtos.Users
{
    public record CreateExperienceCommand
    {
        public required string Title { get; init; }
        public string? Description { get; init; }
        public required DateTime StartDate {  get; init; }
        public required DateTime EndDate {  get; init; }
    }
}
