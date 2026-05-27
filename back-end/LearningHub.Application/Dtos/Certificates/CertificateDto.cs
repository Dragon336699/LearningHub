namespace LearningHub.Application.Dtos.Certificates
{
    public class CertificateDto
    {
        public Guid Id { get; set; }
        public string CertificateName { get; set; } = null!;
        public string Organization { get; set; } = null!;
        public DateOnly IssueDate { get; set; } = default!;
        public DateOnly? ExpirationDate {  get; set; }
        public string CredentialUrl { get; set; } = null!;
    }
}
