using AutoMapper;
using LearningHub.Application.Common.Constants;
using LearningHub.Application.Common.Results;
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
                    throw new Exception(Messages.CertificateMessage.UploadFileFail);
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
            await _unitOfWork.CompleteAsync();

            return Result<CertificateDto>.Success(_mapper.Map<CertificateDto>(certificate));
        }

        public async Task<Result<CertificateDto>> UpdateCertificateAsync(UpdateCertificateCommand command, Guid userId)
        {
            string? uploadUrl = null;

            Certificate? certificate = await _unitOfWork.Certificates.GetByIdAsync(command.Id);

            ValidateCertificate(certificate);

            certificate.CertificateName = command.CertificateName;
            certificate.Organization = command.Organization;
            certificate.IssueDate = command.IssueDate;
            certificate.ExpirationDate = command.ExpirationDate;

            if (command.CredentialFile != null)
            {
                uploadUrl = await _fileStorateService.UploadFileAsync(command.CredentialFile, "Certificates");

                if (uploadUrl == null)
                {
                    throw new Exception(Messages.CertificateMessage.UploadFileFail);
                }
            }

            if (uploadUrl != null)
            {
                certificate.CredentialUrl = uploadUrl;
            }

            await _unitOfWork.CompleteAsync();

            return Result<CertificateDto>.Success(_mapper.Map<CertificateDto>(certificate));
        }

        public async Task DeleteCertificateAsync(Guid certificateId)
        {

            Certificate? certificate = await _unitOfWork.Certificates.GetByIdAsync(certificateId);

            ValidateCertificate(certificate);

            _unitOfWork.Certificates.Remove(certificate);
            await _unitOfWork.CompleteAsync();
        }

        private void ValidateCertificate(Certificate? certificate)
        {
            if (certificate == null)
            {
                throw new KeyNotFoundException(Messages.CertificateMessage.CertificateNull);
            }
        }
    }
}
