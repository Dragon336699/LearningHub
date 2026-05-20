using AutoMapper;
using LearningHub.Domain.Entities;
using LearningHub.Application.Dtos.Exterpises;

namespace LearningHub.Application.Mappers
{
    public class ExpertiseMappingProfile : Profile
    {
        public ExpertiseMappingProfile()
        {
            CreateMap<ExpertisesDto, Expertise>();
        }
    }
}
