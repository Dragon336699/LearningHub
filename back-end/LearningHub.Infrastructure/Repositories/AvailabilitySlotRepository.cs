using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;

namespace LearningHub.Infrastructure.Repositories
{
    public class AvailabilitySlotRepository : GenericRepository<AvailabilitySlot>, IAvailabilitySlotRepository
    {
        public AvailabilitySlotRepository(LearningHubDbContext context) : base(context)
        {

        }
    }
}
