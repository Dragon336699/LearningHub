using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using RetailSystem.Infrastructure.Repositories;

namespace LearningHub.Infrastructure.Repositories
{
    public class ExperienceRepository : GenericRepository<Experience>, IExperienceRepository
    {
        public ExperienceRepository(LearningHubDbContext context): base(context)
        {
            
        }
    }
}
