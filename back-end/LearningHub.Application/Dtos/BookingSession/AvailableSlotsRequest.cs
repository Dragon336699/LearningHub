using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.BookingSession
{
    

    public class AvailableSlotsRequest
    {
        public Guid MentorId { get; set; }
        public DateTime Date { get; set; }
        public SessionDurationType DurationType { get; set; }
    }
    
}
