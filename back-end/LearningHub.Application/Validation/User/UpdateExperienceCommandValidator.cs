using FluentValidation;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Validation.User
{
    public class UpdateExperienceCommandValidator : AbstractValidator<UpdateExperienceCommand>
    {
        public UpdateExperienceCommandValidator()
        {
            RuleFor(e => e.Title)
                .Must(t => !string.IsNullOrWhiteSpace(t)).WithMessage("Experience title is required")
                .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

            RuleFor(e => e.Description)
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

            RuleFor(x => x.StartDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("StartDate cannot be in the future.");

            RuleFor(x => x)
                .Must(x => x.StartDate <= x.EndDate)
                .WithMessage("StartDate must be less than or equal to EndDate.");
        }
    }
}
