using LearningHub.Domain.Enums;

namespace LearningHub.Domain.Entities
{
    public class Course
    {
        public Guid Id {  get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? LearningObjectives {  get; set; }
        public CourseStatus Status { get; set; } = CourseStatus.Draft;
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
