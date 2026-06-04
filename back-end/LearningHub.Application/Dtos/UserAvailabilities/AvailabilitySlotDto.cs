namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public class AvailabilitySlotDto
    {
        public Guid Id { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
