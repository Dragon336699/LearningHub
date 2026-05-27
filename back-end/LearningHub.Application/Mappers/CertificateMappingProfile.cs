using AutoMapper;
using LearningHub.Application.Dtos.Certificates;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class CertificateMappingProfile : Profile
    {
        public CertificateMappingProfile()
        {
            CreateMap<Certificate, CertificateDto>();
        }
    }
}
