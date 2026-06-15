using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Repositories
{
    public class DashboardSummaryRepository : GenericRepository<DashboardSummary>, IDashboardSummaryRepository
    {
        public DashboardSummaryRepository(LearningHubDbContext context) : base(context)
        {

        }
        public async Task<IEnumerable<DashboardSummary>> GetSummariesInRangeAsync(DateTime startDate, DateTime endDate)
        {
            IQueryable<DashboardSummary> query = _context.DashboardSummaries
                .Where(d => d.CreatedAt >= startDate && d.CreatedAt < endDate)
                .OrderBy(d => d.CreatedAt);

            return await query.ToListAsync();
        }
    }
}
