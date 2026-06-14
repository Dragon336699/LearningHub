using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public record CreateUserAvailabilitySettingCommand
    {
        public Guid? Id { get; init; }
        public TimeOnly WorkStartTime { get; init; }
        public TimeOnly WorkEndTime { get; init; }
        public SessionDurationMinutes SessionDurationMinutes { get; init; }
        public BufferTimeMinutes BufferTimeMinutes { get; init; }
        public DateOnly SettingDay { get; init; }
        public List<CreateAvailabilitySlotCommand> AvailabilitySlots { get; init; } = new List<CreateAvailabilitySlotCommand>();
    }
}
