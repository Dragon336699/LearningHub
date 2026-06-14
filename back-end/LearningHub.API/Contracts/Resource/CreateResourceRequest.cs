using LearningHub.Application.Dtos.Common;

namespace LearningHub.API.Contracts.Resource
{
    public record CreateResourceRequest
    {
        public required string Title { get; init; }
        public required string Description { get; init; }
        public Guid CourseId { get; init; }
        public required IFormFile File { get; init; }
    }
}