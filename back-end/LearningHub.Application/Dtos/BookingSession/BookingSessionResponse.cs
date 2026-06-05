using LearningHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class BookingSessionResponse
    {
        public Guid Id { get; set; }
        public Guid MentorId { get; set; }
        public string MentorName { get; set; }
        public Guid TraineeId { get; set; }
        public string TraineeName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Topic { get; set; }
        public SessionType SessionType { get; set; }
        public SessionStatus SessionStatus { get; set; }

    }
}
