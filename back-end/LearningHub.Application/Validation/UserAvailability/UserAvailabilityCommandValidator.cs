using FluentValidation;
using LearningHub.Application.Dtos.UserAvailabilities;

namespace LearningHub.Application.Validation.UserAvailability
{
    public class UserAvailabilityCommandValidator : AbstractValidator<UserAvailabilityCommand>
    {
        public UserAvailabilityCommandValidator()
        {
            RuleForEach(x => x.Availabilities)
                .SetValidator(new CreateUserAvailabilitySettingCommandValidator());
        }
    }
}
