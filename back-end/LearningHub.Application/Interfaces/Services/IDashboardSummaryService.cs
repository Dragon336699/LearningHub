using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.DashboardSummaries;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IDashboardSummaryService
    {
        Task SaveOrUpdateDashboardSummaryAsync();
        Task<Result<IEnumerable<DashboardSummary>>> GetByTimeRangeAsync(GetDashboardSummaryRequest request);
    }
}
