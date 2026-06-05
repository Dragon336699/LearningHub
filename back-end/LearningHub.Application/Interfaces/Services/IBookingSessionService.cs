using LearningHub.Application.Common;
using LearningHub.Application.Dtos.BookingSession;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IBookingSessionService
    {
        Task<Result<string>> CreateBookingSessionAsync(CreateBookingSessionRequest request);
        Task<Result<string>> ApproveSessionAsync(Guid sessionId);
        Task<Result<string>> CancelSessionAsync(Guid sessionId);
        Task<Result<List<AvailableSlotsResponse>>> GetAvailableSlotsAsync(AvailableSlotsRequest request);
        Task<Result<List<BookingSessionResponse>>> GetBookingSessions(GetSessionsRequest request);
    }
}
