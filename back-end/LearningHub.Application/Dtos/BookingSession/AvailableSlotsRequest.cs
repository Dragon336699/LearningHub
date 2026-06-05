using LearningHub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Dtos.BookingSession
{
    

    public class AvailableSlotsRequest
    {
        public Guid MentorId { get; set; }
        public DateTime Date { get; set; }
        public SessionDurationType DurationType { get; set; }
    }
    
}
