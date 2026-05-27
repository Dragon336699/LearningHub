using LearningHub.Application.Dtos.Common;

namespace LearningHub.Application.Dtos.Certificates
{
    public record CreateCertificateCommand
    {
        public required string CertificateName { get; init; }
        public required string Organization { get; init; }
        public required DateOnly IssueDate { get; init; }
        public DateOnly? ExpirationDate { get; init; }
        public FileUploadDto? CredentialFile { get; init; }
    }
}
