using System;
using System.Threading.Tasks;
using LearningHub.Application.Interfaces.Seeder;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Persistence.Seed
{
    public class DashboardSummarySeeder : IDataSeeder
    {
        private readonly LearningHubDbContext _context;

        public DashboardSummarySeeder(LearningHubDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            if (await _context.Set<DashboardSummary>().AnyAsync()) return;

            var yesterday = DateTime.Today.AddDays(-1);

            DashboardSummary mockSummary = new DashboardSummary
            {
                Id= Guid.CreateVersion7(),
                TotalUser = 3,
                TotalSession = 12,
                TotalResource = 5,
                CreatedAt = yesterday
            };

            await _context.Set<DashboardSummary>().AddAsync(mockSummary);
            await _context.SaveChangesAsync();
        }
    }
}