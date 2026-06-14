using FluentValidation;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Validation.User
{
    public class SearchUserProfileCommandValidator : AbstractValidator<SearchUserProfileCommand>
    {
        public SearchUserProfileCommandValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0).WithMessage("Page number must be greater than 0.");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size number must be greater than 0.");

            RuleFor(x => x.Keyword)
                .MaximumLength(100).WithMessage("Keyword must not exceed 100 characters.");
        }
    }
}
