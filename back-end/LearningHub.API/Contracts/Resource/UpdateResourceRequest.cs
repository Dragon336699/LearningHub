namespace LearningHub.API.Contracts.Resource
{
    public record UpdateResourceRequest
    {
        public Guid Id { get; init; }
        public required string Title { get; init; }
        public required string Description { get; init; }
        public Guid CourseId { get; init; }
        public IFormFile? File { get; init; }
    }
}
