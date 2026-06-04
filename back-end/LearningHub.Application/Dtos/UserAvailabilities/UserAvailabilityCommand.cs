namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public record UserAvailabilityCommand
    {
        public List<CreateUserAvailabilityCommand> Availabilities { get; init; } = new List<CreateUserAvailabilityCommand>();
    }
}
