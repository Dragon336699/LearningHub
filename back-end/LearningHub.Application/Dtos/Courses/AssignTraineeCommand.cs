namespace LearningHub.Application.Dtos.Courses
{
    public record AssignTraineesCommand
    {
        public required Guid CourseId { get; init; }
        public required List<Guid> TraineeIds { get; init; } 
    }
}