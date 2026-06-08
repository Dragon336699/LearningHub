using LearningHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class CreateBookingSessionRequest
    {
        public Guid MentorId { get; set; }
        public SessionType SessionType { get; set; }
        public string? Topic { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
