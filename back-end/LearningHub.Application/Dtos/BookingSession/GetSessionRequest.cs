using LearningHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class GetSessionsRequest
    {
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public SessionStatus? Status { get; set; }
    }
}
