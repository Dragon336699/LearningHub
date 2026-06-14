namespace LearningHub.Domain.Entities
{
    public class UserAvailabilitySetting
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public TimeOnly WorkStartTime {  get; set; }
        public TimeOnly WorkEndTime { get; set; }
        public int SessionDurationMinutes { get; set; }
        public int BufferTimeMinutes { get; set; }
        public DateOnly SettingDay {  get; set; }
        public Guid UserId {  get; set; }
        public User User { get; set; } = null!;
        public ICollection<AvailabilitySlot> AvailabilitySlots { get; set; } = new List<AvailabilitySlot>();
    }
}
