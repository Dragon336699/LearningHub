using FluentValidation;
using LearningHub.Application.Dtos.UserAvailabilities;

namespace LearningHub.Application.Validation.UserAvailability
{
    public class GetUserAvailabilityQueryValidator : AbstractValidator<GetUserAvailabilitiesQuery>
    {
        public GetUserAvailabilityQueryValidator()
        {
            RuleFor(x => x.StartDate)
                .LessThan(x => x.EndDate)
                .WithMessage("Start date must less than end date");
        }
    }
}
