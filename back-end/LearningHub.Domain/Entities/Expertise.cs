namespace LearningHub.Domain.Entities
{
    public class Expertise
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public required string ExpertiseName { get; set; }
        public ICollection<User> Users { get; set; } = null!;
    }
}
