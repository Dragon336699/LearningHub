using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.Courses
{
    public class CourseDto
    {
        public Guid Id { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public string? LearningObjectives { get; set; }
        public CourseStatus Status { get; set; }
    }
}
