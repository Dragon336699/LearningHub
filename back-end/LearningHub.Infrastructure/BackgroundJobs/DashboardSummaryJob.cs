using LearningHub.Application.Interfaces.Services;
namespace LearningHub.Infrastructure.BackgroundJobs
{
    
    public class DashboardSummaryJob
    {
        private readonly IDashboardSummaryService _dashboardSummaryService;

        public DashboardSummaryJob(IDashboardSummaryService dashboardSummaryService)
        {
            _dashboardSummaryService = dashboardSummaryService;
        }

        public async Task RunDailySnapshotAsync()
        {
            await _dashboardSummaryService.SaveOrUpdateDashboardSummaryAsync();
        }
    }
}

