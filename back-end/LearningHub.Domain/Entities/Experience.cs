namespace LearningHub.Domain.Entities
{
    public class Experience
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required DateOnly StartDate { get; set; }
        public required DateOnly EndDate { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
