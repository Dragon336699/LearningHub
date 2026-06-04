namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public class CreateAvailabilitySlotCommand
    {
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
