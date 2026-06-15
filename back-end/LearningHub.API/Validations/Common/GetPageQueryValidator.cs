using FluentValidation;
using LearningHub.API.Contracts.Common;

namespace LearningHub.API.Validations.Common
{
    public class GetPageQueryValidator : AbstractValidator<GetPageQuery>
    {
        public GetPageQueryValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0).WithMessage("Page number must be greater than 0.");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size number must be greater than 0.");

            RuleFor(x => x.keyword)
                .MaximumLength(100).WithMessage("Search query must not exceed 100 characters.");
        }
    }
}
