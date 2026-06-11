namespace LearningHub.Domain.Entities
{
    public class Resource
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Url { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public Guid CourseId { get; set; }
        public Course Course { get; set; } = null!;
    }
}
