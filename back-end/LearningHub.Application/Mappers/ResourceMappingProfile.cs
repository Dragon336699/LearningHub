using AutoMapper;
using LearningHub.Application.Dtos.Resources;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class ResourceMappingProfile : Profile
    {
        public ResourceMappingProfile()
        {
            CreateMap<Resource, ResourceDto>();
        }
    }
}
