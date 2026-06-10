using System;
using System.Collections.Generic;
using System.Text;

using System;

namespace LearningHub.Application.Utils
{
    public static class DateTimeUtils
    {
        public static string ToTimeString(DateTime dateTime)
        {
            return dateTime.ToString("HH:mm");
        }

        public static string ToDateString(DateTime dateTime)
        {
            return dateTime.ToString("dd/MM/yyyy");
        }

        public static string ToDateTimeString(DateTime dateTime)
        {
            return dateTime.ToString("dd/MM/yyyy HH:mm");
        }

        public static string ToTimeRangeString( DateTime startTime, DateTime endTime)
        {
            return $"{ToTimeString(startTime)} - {ToTimeString(endTime)}";
        }
    }
}
