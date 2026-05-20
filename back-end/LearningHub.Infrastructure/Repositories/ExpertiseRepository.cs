using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using RetailSystem.Infrastructure.Repositories;

namespace LearningHub.Infrastructure.Repositories
{
    public class ExpertiseRepository : GenericRepository<Expertise>, IExpertiseRepository
    {
        public ExpertiseRepository(LearningHubDbContext context) : base(context)
        {
            
        }
    }
}
