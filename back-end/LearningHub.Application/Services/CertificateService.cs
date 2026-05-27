using AutoMapper;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Certificates;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly IFileStorageService _fileStorateService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public CertificateService(IFileStorageService fileStorateService, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _fileStorateService = fileStorateService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<CertificateDto>> CreateCertificateAsync(CreateCertificateCommand command, Guid userId)
        {
            string? uploadUrl = null;
            if (command.CredentialFile != null)
            {
                uploadUrl = await _fileStorateService.UploadFileAsync(command.CredentialFile, "Certificates");

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
                ExpirationDate = command.ExpirationDate,
                UserId = userId
            };

            if (uploadUrl != null)
            {
                certificate.CredentialUrl = uploadUrl;
            }

            await _unitOfWork.Certificates.AddAsync(certificate);
            var rowEffected = await _unitOfWork.CompleteAsync();

            if (rowEffected == 0)
            {
                throw new Exception("No changes were saved");
            }

            return Result<CertificateDto>.Success(_mapper.Map<CertificateDto>(certificate));
        }

        public async Task<Result<CertificateDto>> UpdateCertificateAsync(UpdateCertificateCommand command, Guid userId)
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
                uploadUrl = await _fileStorateService.UploadFileAsync(command.CredentialFile, "Certificates");

                if (uploadUrl == null)
                {
                    throw new Exception("Upload file failed");
                }
            }

            if (uploadUrl != null)
            {
                certificate.CredentialUrl = uploadUrl;
            }

            var rowEffected = await _unitOfWork.CompleteAsync();

            if (rowEffected == 0)
            {
                throw new Exception("No changes were saved");
            }

            return Result<CertificateDto>.Success(_mapper.Map<CertificateDto>(certificate));
        }

        public async Task DeleteCertificateAsync(Guid certificateId)
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
