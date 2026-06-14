using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;

namespace LearningHub.Infrastructure.Repositories
{
    public class CourseTraineeRepository : GenericRepository<CourseTrainee>, ICourseTraineeRepository
    {
        public CourseTraineeRepository(LearningHubDbContext context): base(context)
        {
            
        }
    }
}
