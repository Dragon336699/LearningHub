using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Dtos.BookingSession
{
    public class AvailableSlotsResponse
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string DisplayText => $"{StartTime:HH:mm} - {EndTime:HH:mm}";
    }
}
