using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IBookingSessionRepository: IGenericRepository<BookingSession>
    {
        Task<bool> IsUserBusyAsync(Guid userId, DateTime startTime, DateTime endTime, string roleName);
        Task<List<BookingSession>> GetBusySlotsAsync(Guid mentorId, DateTime targetDate, DateTime nextDay);
        Task<List<BookingSession>> GetSessionsByUserAndDateAsync(Guid userId, DateTime targetDate, SessionStatus? status);
        Task<List<BookingSession>> GetOverlapingSession(BookingSession currentSession);
        Task<int> CountByDate(DateTime date);
    }
}
