using LearningHub.Domain.Enums;

namespace LearningHub.Domain.Entities
{
    

    public class BookingSession
    {
        public Guid Id { get; set; }
        public Guid MentorId { get; set; }
        public Guid TraineeId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public SessionType SessionType { get; set; }
        public string? Topic { get; set; }
        public SessionStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public User Mentor { get; set; }
        public User Trainee { get; set; }
    }
}
