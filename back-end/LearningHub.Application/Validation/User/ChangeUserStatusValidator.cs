using FluentValidation;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Validation.User
{
    public class ChangeUserStatusValidator : AbstractValidator<UpdateUserStatusCommand>
    {
        public ChangeUserStatusValidator()
        {
            RuleFor(us => us.UserStatus)
                .IsInEnum()
                .WithMessage("Status must be a valid enum value.");
        }
    }
}
