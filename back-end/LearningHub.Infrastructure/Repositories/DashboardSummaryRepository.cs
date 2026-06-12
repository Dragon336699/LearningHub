using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Infrastructure.Repositories
{
    public class DashboardSummaryRepository : GenericRepository<DashboardSummary>, IDashboardSummaryRepository
    {
        public DashboardSummaryRepository(LearningHubDbContext context) : base(context)
        {

        }
    }
}
