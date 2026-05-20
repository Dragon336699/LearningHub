namespace LearningHub.API.Contracts.Users
{
    public class CreateExperienceCommand
    {
        public required string Title { get; init; }
        public string? Description { get; init; }
        public required DateTimeOffset StartDate {  get; init; }
        public required DateTimeOffset EndDate {  get; init; }
    }
}
