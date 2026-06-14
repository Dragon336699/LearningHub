namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public record UserAvailabilityCommand
    {
        public List<CreateUserAvailabilitySettingCommand> Availabilities { get; init; } = new List<CreateUserAvailabilitySettingCommand>();
    }
}
