namespace LearningHub.Domain.Entities
{
    public class Certificate
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public required string CertificateName { get; set; }
        public required string Organization { get; set; }
        public required DateTimeOffset IssueDate { get; set; }
        public DateTimeOffset? ExpirationDate { get; set; }
        public string? CredentialUrl { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
