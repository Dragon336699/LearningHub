using AutoMapper;
using LearningHub.Domain.Entities;
using LearningHub.Application.Dtos.Expertises;

namespace LearningHub.Application.Mappers
{
    public class ExpertiseMappingProfile : Profile
    {
        public ExpertiseMappingProfile()
        {
            CreateMap<ExpertiseDto, Expertise>();
            CreateMap<Expertise, ExpertiseDto>();
        }
    }
}
