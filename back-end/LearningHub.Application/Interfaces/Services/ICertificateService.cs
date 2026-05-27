using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Certificates;

namespace LearningHub.Application.Interfaces.Services
{
    public interface ICertificateService
    {
        Task<Result<CertificateDto>> CreateCertificateAsync(CreateCertificateCommand command, Guid userId);
        Task<Result<CertificateDto>> UpdateCertificateAsync(UpdateCertificateCommand command, Guid userId);
        Task DeleteCertificateAsync(Guid certificateId);
    }
}
