using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class CreateBookingSessionRequest
    {
        public Guid MentorId { get; set; }
        public SessionType SessionType { get; set; }
        public string? Topic { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
