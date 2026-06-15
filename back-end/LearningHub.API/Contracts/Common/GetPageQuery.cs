namespace LearningHub.API.Contracts.Common
{
    public record GetPageQuery
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
        public string? keyword { get; init; } = string.Empty;
    }
}
