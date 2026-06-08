using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Repositories
{
    public class BookingSessionRepository : GenericRepository<BookingSession>, IBookingSessionRepository
    {
        public BookingSessionRepository(LearningHubDbContext context) : base(context)
        {
        }

        public async Task<bool> IsTraineeBusyAsync(Guid traineeId, DateTime startTime, DateTime endTime)
        {
            return await _context.BookingSessions
                .AnyAsync(s => s.TraineeId == traineeId
                            && s.Status != SessionStatus.Cancelled
                            && startTime < s.EndTime
                            && endTime > s.StartTime);
        }

        public async Task<bool> IsMentorBusyAsync(Guid mentorId, DateTime startTime, DateTime endTime)
        {
            return await _context.BookingSessions
                .AnyAsync(s => s.MentorId == mentorId
                            && s.Status == SessionStatus.Approved
                            && startTime < s.EndTime
                            && endTime > s.StartTime);
        }

        public async Task<List<BookingSession>> GetBusySlotsAsync(Guid mentorId, DateTime targetDate, DateTime nextDay )
        {
             return await _context.BookingSessions
                .Where(s => s.MentorId == mentorId
                        && s.Status == SessionStatus.Approved
                        && s.StartTime >= targetDate
                        && s.EndTime <= nextDay)
                .OrderBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<List<BookingSession>> GetSessionsByUserAndDateAsync(Guid userId, DateTime targetDate, SessionStatus? status)
        {
            DateTime startOfDay = targetDate.Date;
            DateTime endOfDay = startOfDay.AddDays(1);

            var query = _context.BookingSessions
                .Where(s =>
                    (s.MentorId == userId || s.TraineeId == userId) &&
                    s.StartTime >= startOfDay && s.StartTime < endOfDay);

            if (status.HasValue)
            {
                query = query.Where(s => s.Status == status.Value);
            }

            return await query
                .Include(s => s.Mentor)
                .Include(s => s.Trainee)
                .OrderBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<List<BookingSession>> GetOverlapingSession(BookingSession currentSession)
        {
            List<BookingSession> bookingSessions = await _context.BookingSessions.Where(s => s.Id != currentSession.Id
                             && s.MentorId == currentSession.MentorId
                             && s.Status == SessionStatus.Pending
                             && s.StartTime < currentSession.EndTime
                             && s.EndTime > currentSession.StartTime)
                    .ToListAsync();
            return bookingSessions;
        }

	}
}
