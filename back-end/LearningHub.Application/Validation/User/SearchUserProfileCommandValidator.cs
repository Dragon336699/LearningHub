using FluentValidation;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Validation.User
{
    public class SearchUserProfileCommandValidator : AbstractValidator<SearchUserProfileCommand>
    {
        public SearchUserProfileCommandValidator()
        {
            RuleFor(x => x.Keyword)
                .MaximumLength(100).WithMessage("Keyword must not exceed 100 characters.");
        }
    }
}
