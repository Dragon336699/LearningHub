using AutoMapper;
using LearningHub.Application.Dtos.Experiences;
using LearningHub.Application.Dtos.Users;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class ExperienceMappingProfile : Profile
    {
        public ExperienceMappingProfile()
        {
            CreateMap<CreateExperienceCommand, Experience>();
            CreateMap<Experience, ExperienceDto>();
        }
    }
}
