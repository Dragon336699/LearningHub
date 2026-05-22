using LearningHub.Application.Dtos.Certificates;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IUnitOfWork _unitOfWork;
        public CertificateService(ICloudinaryService cloudinaryService, IUnitOfWork unitOfWork)
        {
            _cloudinaryService = cloudinaryService;
            _unitOfWork = unitOfWork;
        }

        public async Task CreateCertificateAsync(CreateCertificateCommand command, Guid userId)
        {
            string? uploadUrl = null;
            if (command.CredentialFile != null)
            {
                uploadUrl = await _cloudinaryService.UploadFileAsync(command.CredentialFile, "Certificates");

                if (uploadUrl == null)
                {
                    throw new Exception("Upload file failed");
                }
            }

            Certificate certificate = new Certificate
            {
                CertificateName = command.CertificateName,
                Organization = command.Organization,
                IssueDate = command.IssueDate,
                ExpirationDate = command.IssueDate,
                UserId = userId
            };

            if (uploadUrl != null)
            {
                certificate.CredentialUrl = uploadUrl;
            }

            await _unitOfWork.Certificates.AddAsync(certificate);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateCertificateAsync(UpdateCertificateCommand command, Guid userId)
        {
            string? uploadUrl = null;

            Certificate? certificate =  await _unitOfWork.Certificates.GetByIdAsync(command.Id);
            if (certificate == null)
            {
                throw new KeyNotFoundException("Certificate not found");
            }
            
            certificate.CertificateName = command.CertificateName;
            certificate.Organization = command.Organization;
            certificate.IssueDate = command.IssueDate;
            certificate.ExpirationDate = command.ExpirationDate;

            if (command.CredentialFile != null)
            {
                uploadUrl = await _cloudinaryService.UploadFileAsync(command.CredentialFile, "Certificates");

                if (uploadUrl == null)
                {
                    throw new Exception("Upload file failed");
                }
            }

            if (uploadUrl != null)
            {
                certificate.CredentialUrl = uploadUrl;
            }

            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteCertificate(Guid certificateId)
        {

            Certificate? certificate = await _unitOfWork.Certificates.GetByIdAsync(certificateId);

            if (certificate == null)
            {
                throw new KeyNotFoundException("Certificate not found");
            }

            _unitOfWork.Certificates.Remove(certificate);
            await _unitOfWork.CompleteAsync();
        }
    }
}
