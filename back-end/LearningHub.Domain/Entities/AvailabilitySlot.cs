namespace LearningHub.Domain.Entities
{
    public class AvailabilitySlot
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public Guid UserAvailabilitySettingId {  get; set; }
        public UserAvailabilitySetting UserAvailabilitySetting { get; set; } = null!;
    }
}
