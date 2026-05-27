namespace LearningHub.Application.Dtos.Certificates
{
    public record CertificateDto
    {
        public Guid Id { get; init; }
        public string CertificateName { get; init; } = null!;
        public string Organization { get; init; } = null!;
        public DateOnly IssueDate { get; init; } = default!;
        public DateOnly? ExpirationDate {  get; init; }
        public string CredentialUrl { get; init; } = null!;
    }
}
