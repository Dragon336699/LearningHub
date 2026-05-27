using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;

namespace LearningHub.Infrastructure.Repositories
{
    public class ExpertiseRepository : GenericRepository<Expertise>, IExpertiseRepository
    {
        public ExpertiseRepository(LearningHubDbContext context) : base(context)
        {
            
        }
    }
}
