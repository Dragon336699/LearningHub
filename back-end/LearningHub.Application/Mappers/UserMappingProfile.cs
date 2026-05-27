using AutoMapper;
using LearningHub.Application.Dtos.Users;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}
