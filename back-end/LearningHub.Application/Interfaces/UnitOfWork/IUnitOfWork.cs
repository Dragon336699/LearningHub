using LearningHub.Application.Interfaces.Repositories;

namespace LearningHub.Application.Interfaces.UnitOfWork
{
    public interface IUnitOfWork: IDisposable
    {
        IExpertiseRepository Expertises { get; }
        IExperienceRepository Experiences { get; }
        ICertificateRepository Certificates { get; }
        ICourseRepository Courses { get; }
        IUserRepository Users { get; }
        IBookingSessionRepository BookingSessions { get; }
        IAvailabilitySlotRepository AvailabilitySlots { get; }
        IUserAvailabilitySettingRepository UserAvailabilitySetting { get; }
        IResourceRepository Resources { get; }
        int Complete();
        Task<int> CompleteAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
