using LearningHub.Application.Interfaces.Repositories;

namespace LearningHub.Application.Interfaces.UnitOfWork
{
    public interface IUnitOfWork
    {
        IExpertiseRepository Expertises { get; }
        IExperienceRepository Experiences { get; }
        ICertificateRepository Certificates { get; }
        ICourseRepository Courses { get; }
        IUserRepository Users { get; }
        IAvailabilitySlotRepository AvailabilitySlots { get; }
        IUserAvailabilitySettingRepository UserAvailabilitySetting { get; }
        int Complete();
        Task<int> CompleteAsync();
    }
}
