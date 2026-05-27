using LearningHub.Application.Dtos.Certificates;

namespace LearningHub.Application.Interfaces.Services
{
    public interface ICertificateService
    {
        Task CreateCertificateAsync(CreateCertificateCommand command, Guid userId);
        Task UpdateCertificateAsync(UpdateCertificateCommand command, Guid userId);
        Task DeleteCertificateAsync(Guid certificateId);
    }
}
