using LearningHub.Application.Utils;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class AvailableSlotsResponse
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string DisplayText => DateTimeUtils.ToTimeRangeString(StartTime, EndTime);
    }
}
