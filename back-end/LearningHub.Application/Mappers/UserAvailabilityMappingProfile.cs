using AutoMapper;
using LearningHub.Application.Dtos.UserAvailabilities;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class UserAvailabilityMappingProfile : Profile
    {
        public UserAvailabilityMappingProfile()
        {
            CreateMap<CreateAvailabilitySlotCommand, AvailabilitySlot>();
            CreateMap<UserAvailabilitySetting, UserAvailabilityDto>();
            CreateMap<AvailabilitySlot, AvailabilitySlotDto>();
        }
    }
}
