using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace LearningHub.Infrastructure.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly LearningHubDbContext _context;
        private IDbContextTransaction? _currentTransaction;
        public IExpertiseRepository Expertises { get; }
        public IExperienceRepository Experiences { get; }
        public ICertificateRepository Certificates { get; }
        public ICourseRepository Courses { get; }
        public IUserRepository Users { get; }
        public IBookingSessionRepository BookingSessions { get; }
        public ICourseTraineeRepository CourseTrainees { get; }
        public IRoleRepository Roles { get; }
        public UnitOfWork(
            LearningHubDbContext context,
            IExpertiseRepository expertiseRepository,
            IExperienceRepository experienceRepository,
            ICertificateRepository certificateRepository,
            ICourseRepository courseRepository,
            IUserRepository userRepository,
            IBookingSessionRepository bookingSessionRepository,
            ICourseTraineeRepository courseTraineeRepository,
            IRoleRepository roleRepository
        )
        {
            _context = context;
            Expertises = expertiseRepository;
            Experiences = experienceRepository;
            Certificates = certificateRepository;
            Courses = courseRepository;
            Users = userRepository;
            BookingSessions = bookingSessionRepository;
            CourseTrainees = courseTraineeRepository;
            Roles = roleRepository;
        }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public Task<int> CompleteAsync()
        {
            return _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _currentTransaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                await _currentTransaction.CommitAsync();
            }
            finally
            {
                _currentTransaction.Dispose();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            await _currentTransaction.RollbackAsync();
            _currentTransaction.Dispose();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
