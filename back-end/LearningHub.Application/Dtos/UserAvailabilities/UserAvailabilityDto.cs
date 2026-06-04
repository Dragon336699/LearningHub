namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public class UserAvailabilityDto
    {
        public Guid Id { get; set; }
        public TimeOnly WorkStartTime { get; set; }
        public TimeOnly WorkEndTime { get; set; }
        public int SessionDurationMinutes { get; set; }
        public int BufferTimeMinutes { get; set; }
        public DateOnly SettingDay { get; set; }
        public List<AvailabilitySlotDto> AvailabilitySlots { get; set; } = new List<AvailabilitySlotDto>();
    }
}
