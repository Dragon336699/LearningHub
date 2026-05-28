using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Infrastructure.Data;

namespace LearningHub.Infrastructure.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly LearningHubDbContext _context;
        public IExpertiseRepository Expertises { get; }
        public IExperienceRepository Experiences { get; }
        public ICertificateRepository Certificates { get; }
        public ICourseRepository Courses { get; }
        public UnitOfWork(
            LearningHubDbContext context,
            IExpertiseRepository expertiseRepository,
            IExperienceRepository experienceRepository,
            ICertificateRepository certificateRepository,
            ICourseRepository courseRepository
        )
        {
            _context = context;
            Expertises = expertiseRepository;
            Experiences = experienceRepository;
            Certificates = certificateRepository;
            Courses = courseRepository;
        }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public Task<int> CompleteAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
