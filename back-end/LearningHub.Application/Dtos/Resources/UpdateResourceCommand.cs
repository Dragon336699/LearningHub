using LearningHub.Application.Dtos.Common;

namespace LearningHub.Application.Dtos.Resources
{
    public record UpdateResourceCommand
    {
        public Guid Id { get; init; }
        public required string Title { get; init; }
        public required string Description { get; init; }
        public Guid CourseId { get; init; }
        public FileUploadDto? ResourceFile { get; init; }
    }
}
