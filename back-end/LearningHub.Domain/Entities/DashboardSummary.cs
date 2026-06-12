namespace LearningHub.Domain.Entities
{
    public class DashboardSummary
    {
        public long Id { get; set; }
        public long TotalUser { get; set; }
        public long TotalSession { get; set; }
        public long TotalResource { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
