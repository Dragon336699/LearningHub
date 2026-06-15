using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class GetSessionsRequest
    {
        public DateTime Date { get; set; }
        public SessionStatus? Status { get; set; }
    }
}
