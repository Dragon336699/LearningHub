using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Mappers
{
    public static class BookingSessionMappingProfile
    {
        public static BookingSessionResponse ToResponse(BookingSession session)
        {
            return new BookingSessionResponse
            {
                Id = session.Id,
                MentorId = session.MentorId,
                MentorName = session.Mentor.FirstName + " " + session.Mentor.LastName,
                TraineeId = session.TraineeId,
                TraineeName = session.Trainee.FirstName + " " + session.Trainee.LastName,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Topic = session.Topic,
                SessionType = session.SessionType,
                SessionStatus = session.Status
            };
        }

        public static List<BookingSessionResponse> ToResponseList(List<BookingSession> sessions)
        {
            List<BookingSessionResponse> responses = new List<BookingSessionResponse>();
            foreach (var session in sessions)
            {
                responses.Add(ToResponse(session));
            }
            return responses;
        }

        public static BookingSession ToEntity(CreateBookingSessionRequest request, Guid traineeId)
        {
            return new BookingSession
            {
                Id = Guid.CreateVersion7(),
                MentorId = request.MentorId,
                TraineeId = traineeId,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                SessionType = request.SessionType,
                Topic = request.Topic,
                Status = SessionStatus.Pending
            };
        }
    }
}
