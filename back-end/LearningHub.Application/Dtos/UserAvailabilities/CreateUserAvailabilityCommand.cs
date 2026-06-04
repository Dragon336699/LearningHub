namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public record CreateUserAvailabilityCommand
    {
        public Guid? Id { get; init; }
        public TimeOnly WorkStartTime { get; init; }
        public TimeOnly WorkEndTime { get; init; }
        public int SessionDurationMinutes { get; init; }
        public int BufferTimeMinutes { get; init; }
        public DateOnly SettingDay { get; init; }
        public List<CreateAvailabilitySlotCommand> AvailabilitySlots { get; init; } = new List<CreateAvailabilitySlotCommand>();
    }
}
