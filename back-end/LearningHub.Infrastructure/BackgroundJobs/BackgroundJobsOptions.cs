using Microsoft.Extensions.Configuration;
using TimeZoneConverter;

namespace LearningHub.Infrastructure.BackgroundJobs
{
    public class BackgroundJobsOptions
    {
        public const string SectionName = "BackgroundJobs"; // This is POCO class's convention
        public string Timezone { get; set; } = "UTC"; //because Hangfire using UTC
        public JobConfig Dashboard { get; set; } = new();

        public class JobConfig
        {
            public string JobName { get; set; } = string.Empty;
            public string Schedule { get; set; } = string.Empty;
        }

        public TimeZoneInfo TimeZoneInfo
        {
            get
            {
                try
                {
                    //multi-os converter
                    return TZConvert.GetTimeZoneInfo(Timezone);
                }
                catch (Exception)
                {
                    return TimeZoneInfo.Utc;
                }
            }
        }
    }
}