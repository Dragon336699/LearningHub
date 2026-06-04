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
        public IUserRepository Users { get; }
        public IAvailabilitySlotRepository AvailabilitySlots { get; }
        public IUserAvailabilitySettingRepository UserAvailabilitySetting { get; }
        public UnitOfWork(
            LearningHubDbContext context,
            IExpertiseRepository expertiseRepository,
            IExperienceRepository experienceRepository,
            ICertificateRepository certificateRepository,
            ICourseRepository courseRepository,
            IUserRepository userRepository,
            IAvailabilitySlotRepository availabilitySlotRepository,
            IUserAvailabilitySettingRepository userAvailabilitySettingRepository
        )
        {
            _context = context;
            Expertises = expertiseRepository;
            Experiences = experienceRepository;
            Certificates = certificateRepository;
            Courses = courseRepository;
            Users = userRepository;
            AvailabilitySlots = availabilitySlotRepository;
            UserAvailabilitySetting = userAvailabilitySettingRepository;
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
