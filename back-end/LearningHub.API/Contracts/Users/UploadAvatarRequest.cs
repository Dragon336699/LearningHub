namespace LearningHub.API.Contracts.Users
{
    public record UploadAvatarRequest
    {
        public IFormFile? AvatarFile { get; init; }
    }
}
