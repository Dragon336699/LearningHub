using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.Courses
{
    public record UpdateCourseStatusCommand
    {
        public Guid Id { get; init; }
        public CourseStatus Status { get; init; }
    }
}
