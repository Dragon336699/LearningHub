using LearningHub.Application.Dtos.Common;

namespace LearningHub.Application.Dtos.Resources
{
    public record CreateResourceCommand
    {
        public required string Title { get; init; }
        public required string Description { get; init; }
        public Guid CourseId { get; init; }
        public required FileUploadDto ResourceFile { get; init; }
    }
}
