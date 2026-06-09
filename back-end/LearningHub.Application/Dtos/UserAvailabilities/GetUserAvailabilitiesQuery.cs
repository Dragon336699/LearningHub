namespace LearningHub.Application.Dtos.UserAvailabilities
{
    public record GetUserAvailabilitiesQuery
    {
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
    }
}
