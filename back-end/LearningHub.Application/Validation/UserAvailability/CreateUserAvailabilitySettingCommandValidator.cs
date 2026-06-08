using FluentValidation;
using LearningHub.Application.Dtos.UserAvailabilities;

namespace LearningHub.Application.Validation.UserAvailability
{
    public class CreateUserAvailabilitySettingCommandValidator : AbstractValidator<CreateUserAvailabilitySettingCommand>
    {
        public CreateUserAvailabilitySettingCommandValidator()
        {
            RuleFor(x => x.WorkEndTime)
                .GreaterThan(x => x.WorkStartTime)
                .WithMessage("Work end time must be greater than work start time.");

            RuleFor(x => x.SessionDurationMinutes)
                .IsInEnum()
                .WithMessage("Invalid session duration minutes value.");

            RuleFor(x => x.BufferTimeMinutes)
                .IsInEnum()
                .WithMessage("Invalid buffer time minutes value.");

            RuleFor(x => x.SettingDay)
                .Must(st => st >= DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Setting day must be today or later.");

            RuleForEach(x => x.AvailabilitySlots)
                .SetValidator(new CreateAvailabilitySlotCommandValidator());
        }
    }
}
