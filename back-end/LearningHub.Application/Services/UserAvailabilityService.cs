using AutoMapper;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.UserAvailabilities;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;

namespace LearningHub.Application.Services
{
    public class UserAvailabilityService : IUserAvailabilityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public UserAvailabilityService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<UserAvailabilityDto>>> CreateUserAvailabilities(List<CreateUserAvailabilitySettingCommand> command, Guid userId)
        {
            var allSettings = new List<UserAvailabilitySetting>();

            foreach (var cmd in command)
            {
                UserAvailabilitySetting? existing = await _unitOfWork.UserAvailabilitySetting
                    .GetWithConditionAndIncludeAsync(s => s.SettingDay == cmd.SettingDay && s.UserId == userId);

                if (existing != null)
                {
                    existing.WorkStartTime = cmd.WorkStartTime;
                    existing.WorkEndTime = cmd.WorkEndTime;
                    existing.SessionDurationMinutes = (int)cmd.SessionDurationMinutes;
                    existing.BufferTimeMinutes = (int)cmd.BufferTimeMinutes;

                    var bookedSlots = await _unitOfWork.AvailabilitySlots.FindAllAsync(s => s.UserAvailabilitySettingId == existing.Id && s.Status == UserAvailabilityStatus.Booked);

                    var oldSlots = await _unitOfWork.AvailabilitySlots
                        .FindAllAsync(s => s.UserAvailabilitySettingId == existing.Id && s.Status != UserAvailabilityStatus.Booked);
                    _unitOfWork.AvailabilitySlots.RemoveRange(oldSlots);

                    var newSlots = cmd.AvailabilitySlots
                        .Where(cmd => !bookedSlots.Any(booked => booked.StartTime == cmd.StartTime))
                        .Select(slot => new AvailabilitySlot
                    {
                        StartTime = slot.StartTime,
                        EndTime = slot.EndTime,
                        UserAvailabilitySettingId = existing.Id
                    }).ToList();
                    await _unitOfWork.AvailabilitySlots.AddRangeAsync(newSlots);

                    allSettings.Add(existing);
                }
                else
                {
                    var settingId = Guid.NewGuid();
                    var newSetting = new UserAvailabilitySetting
                    {
                        Id = settingId,
                        WorkStartTime = cmd.WorkStartTime,
                        WorkEndTime = cmd.WorkEndTime,
                        SessionDurationMinutes = (int)cmd.SessionDurationMinutes,
                        BufferTimeMinutes = (int)cmd.BufferTimeMinutes,
                        SettingDay = cmd.SettingDay,
                        UserId = userId,
                        AvailabilitySlots = cmd.AvailabilitySlots.Select(slot => new AvailabilitySlot
                        {
                            StartTime = slot.StartTime,
                            EndTime = slot.EndTime,
                            UserAvailabilitySettingId = settingId
                        }).ToList()
                    };

                    await _unitOfWork.UserAvailabilitySetting.AddRangeAsync(new[] { newSetting });
                    allSettings.Add(newSetting);
                }
            }

            await _unitOfWork.CompleteAsync();

            var userAvailabilitySettingsWithoutSlots = await _unitOfWork.UserAvailabilitySetting.FindAllAsync(uas => !uas.AvailabilitySlots.Any());
            _unitOfWork.UserAvailabilitySetting.RemoveRange(userAvailabilitySettingsWithoutSlots);
            await _unitOfWork.CompleteAsync();

            return Result<List<UserAvailabilityDto>>.Success(_mapper.Map<List<UserAvailabilityDto>>(allSettings));
        }

        public async Task<Result<List<UserAvailabilityDto>>> GetUserAvailabilities(Guid userId)
        {
            List<UserAvailabilitySetting> userAvailabilitySettings = await _unitOfWork.UserAvailabilitySetting.GetUserAvailabilities(userId);
            return Result<List<UserAvailabilityDto>>.Success(_mapper.Map<List<UserAvailabilityDto>>(userAvailabilitySettings));
        }

    }
}
