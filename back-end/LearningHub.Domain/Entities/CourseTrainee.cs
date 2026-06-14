namespace LearningHub.Domain.Entities
{
    public class CourseTrainee
    {
        public Guid CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public Guid TraineeId { get; set; }
        public User Trainee { get; set; } = null!;

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public int Progress { get; set; } = 0;
    }
}