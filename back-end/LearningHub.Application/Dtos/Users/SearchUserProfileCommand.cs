namespace LearningHub.Application.Dtos.Users
{
    public record SearchUserProfileCommand
    {
        public int Page { get; init; }
        public int PageSize { get; init; }
        public string Keyword { get; init; } = string.Empty;
        public List<Guid> ExpertiseIds { get; init; } = new List<Guid>();
    }
}
