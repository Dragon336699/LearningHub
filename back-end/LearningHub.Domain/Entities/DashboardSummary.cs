namespace LearningHub.Domain.Entities
{
    public class DashboardSummary
    {
        public Guid Id { get; set; }
        public int TotalUser { get; set; }
        public int TotalSession { get; set; }
        public int TotalResource { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
