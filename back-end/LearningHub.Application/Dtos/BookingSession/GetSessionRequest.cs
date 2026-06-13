using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class GetSessionsRequest
    {
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public SessionStatus? Status { get; set; }
    }
}
