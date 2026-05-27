namespace LearningHub.Application.Dtos.Users
{
    public record SearchUserProfileCommand
    {
        public string Keyword { get; init; } = string.Empty;
        public List<Guid> ExpertiseIds { get; init; } = new List<Guid>();
    }
}
