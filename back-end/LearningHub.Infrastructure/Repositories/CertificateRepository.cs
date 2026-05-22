using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using RetailSystem.Infrastructure.Repositories;

namespace LearningHub.Infrastructure.Repositories
{
    public class CertificateRepository : GenericRepository<Certificate>, ICertificateRepository
    {
        public CertificateRepository(LearningHubDbContext context) : base(context)
        {
            
        }
    }
}
