using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.Courses
{
    public record CreateCourseCommand
    {
        public required string Title { get; init; }
        public required string Description { get; init; }
        public string? LearningObjectives { get; init; }
    }
}
