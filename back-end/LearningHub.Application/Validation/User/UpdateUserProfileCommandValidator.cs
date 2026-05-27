using FluentValidation;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Validation.User
{
    public class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
    {
        public UpdateUserProfileCommandValidator()
        {
            RuleFor(u => u.FirstName)
                .NotEmpty().WithMessage("FirstName is required")
                .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");
            RuleFor(u => u.LastName)
                .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");
            RuleFor(u => u.CoachCost)
                .GreaterThanOrEqualTo(0)
                .When(u => u.CoachCost.HasValue)
                .WithMessage("Coach cost must be greater than or equal to 0.");
            RuleFor(u => u.Bio)
                .MaximumLength(500)
                .When(u => u.Bio != null)
                .WithMessage("Bio must not exceed 500 characters");
            RuleFor(u => u.Skills)
                .MaximumLength(200)
                .When(u => u.Skills != null)
                .WithMessage("Skills must not exceed 200 characters");
        }
    }
}
