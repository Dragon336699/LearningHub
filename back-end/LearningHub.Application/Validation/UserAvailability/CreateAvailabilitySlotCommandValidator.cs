using FluentValidation;
using LearningHub.Application.Dtos.UserAvailabilities;

namespace LearningHub.Application.Validation.UserAvailability
{
    public class CreateAvailabilitySlotCommandValidator : AbstractValidator<CreateAvailabilitySlotCommand>
    {
        public CreateAvailabilitySlotCommandValidator()
        {
            RuleFor(x => x.StartTime)
                .LessThan(x => x.EndTime)
                .WithMessage("Start time must be less than end time.");
        }
    }
}
