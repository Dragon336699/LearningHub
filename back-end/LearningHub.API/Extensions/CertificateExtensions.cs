using LearningHub.API.Contracts.Certificates;
using LearningHub.Application.Dtos.Certificates;
using LearningHub.Application.Dtos.Common;

namespace LearningHub.API.Extensions
{
    public static class CertificateExtensions
    {
        public static CreateCertificateCommand ToCreateCertificateCommand(this CreateCertificateRequest request)
        {

            FileUploadDto? credentialFile = null;

            if (request.CredentialFile != null)
            {
                credentialFile = new FileUploadDto
                {
                    FileName = request.CredentialFile.FileName,
                    Content = request.CredentialFile.OpenReadStream(),
                    ContentType = request.CredentialFile.ContentType
                };
            }

            return new CreateCertificateCommand
            {
                CertificateName = request.CertificateName,
                Organization = request.Organization,
                IssueDate = request.IssueDate,
                ExpirationDate = request.ExpirationDate,
                CredentialFile = credentialFile
            };
        }

        public static UpdateCertificateCommand ToUpdateCertificateCommand(this UpdateCertificateRequest request)
        {

            FileUploadDto? credentialFile = null;

            if (request.CredentialFile != null)
            {
                credentialFile = new FileUploadDto
                {
                    FileName = request.CredentialFile.FileName,
                    Content = request.CredentialFile.OpenReadStream(),
                    ContentType = request.CredentialFile.ContentType
                };
            }

            return new UpdateCertificateCommand
            {
                Id = request.Id,
                CertificateName = request.CertificateName,
                Organization = request.Organization,
                IssueDate = request.IssueDate,
                ExpirationDate = request.ExpirationDate,
                CredentialFile = credentialFile
            };
        }
    }
}
