namespace LearningHub.API.Contracts.Certificates
{
    public record UpdateCertificateRequest
    {
        public Guid Id { get; init; }
        public required string CertificateName { get; init; }
        public required string Organization { get; init; }
        public required DateOnly IssueDate { get; init; }
        public DateOnly? ExpirationDate { get; init; }
        public IFormFile? CredentialFile { get; init; }
    }
}
