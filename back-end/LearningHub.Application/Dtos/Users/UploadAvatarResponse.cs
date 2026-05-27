namespace LearningHub.Application.Dtos.Users
{
    public record UploadAvatarResponse
    {
        public required string AvatarUrl { get; init; }
    }
}
