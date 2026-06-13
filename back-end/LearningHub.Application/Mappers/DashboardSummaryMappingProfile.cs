using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public static class DashboardSummaryMappingProfile
    {
        public static DashboardSummary ToEntity(int totalUserCount, int totalResourceCount, int totalSessionCount, DateTime date) {
            return new DashboardSummary
            {
                Id= Guid.CreateVersion7(),
                TotalUser = totalUserCount,
                TotalResource = totalResourceCount,
                TotalSession = totalSessionCount,
                CreatedAt = date,
            };
        }

        public static void ToEntityUpdate(DashboardSummary existingSummary, int totalUserCount, int totalResourceCount, int totalSessionCount) {
            existingSummary.TotalUser = totalUserCount;
            existingSummary.TotalResource = totalResourceCount;
            existingSummary.TotalSession = totalSessionCount;
        }
    }
}
