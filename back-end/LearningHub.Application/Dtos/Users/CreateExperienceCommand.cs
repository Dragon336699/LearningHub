namespace LearningHub.Application.Dtos.Users
{
    public record CreateExperienceCommand
    {
        public required string Title { get; init; }
        public string? Description { get; init; }
        public required DateOnly StartDate {  get; init; }
        public required DateOnly EndDate {  get; init; }
    }
}
