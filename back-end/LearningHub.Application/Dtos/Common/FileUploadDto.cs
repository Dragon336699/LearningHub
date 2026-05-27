namespace LearningHub.Application.Dtos.Common
{
    public record FileUploadDto
    {
        public required Stream Content {  get; init; }
        public required string FileName {  get; init; }
        public required string ContentType { get; init; }
    }
}
