namespace LearningHub.API.Contracts.Certificates
{
    public record CreateCertificateRequest
    {
        public required string CertificateName { get; init; }
        public required string Organization { get; init; }
        public required DateTime IssueDate { get; init; }
        public DateTime? ExpirationDate { get; init; }
        public IFormFile? CredentialFile { get; init; }
    }
}
