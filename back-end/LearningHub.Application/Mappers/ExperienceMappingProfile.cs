using AutoMapper;
using LearningHub.API.Contracts.Users;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class ExperienceMappingProfile : Profile
    {
        public ExperienceMappingProfile()
        {
            CreateMap<CreateExperienceCommand, Experience>();
        }
    }
}
