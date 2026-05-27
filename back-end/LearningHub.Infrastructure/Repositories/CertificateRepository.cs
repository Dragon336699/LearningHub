using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;

namespace LearningHub.Infrastructure.Repositories
{
    public class CertificateRepository : GenericRepository<Certificate>, ICertificateRepository
    {
        public CertificateRepository(LearningHubDbContext context) : base(context)
        {
            
        }
    }
}
