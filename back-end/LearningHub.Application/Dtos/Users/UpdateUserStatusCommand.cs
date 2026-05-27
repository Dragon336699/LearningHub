using LearningHub.Domain.Enums;

namespace LearningHub.Application.Dtos.Users
{
    public record UpdateUserStatusCommand
    {
        public UserStatus UserStatus { get; init; }
    }
}
