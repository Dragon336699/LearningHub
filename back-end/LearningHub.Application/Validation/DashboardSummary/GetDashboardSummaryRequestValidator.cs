using FluentValidation;
using LearningHub.Application.Dtos.DashboardSummaries;

namespace LearningHub.Application.Validation.DashboardSummary
{
    public class GetDashboardSummaryRequestValidator : AbstractValidator<GetDashboardSummaryRequest>
    {
        public GetDashboardSummaryRequestValidator()
        {
            RuleFor(x => x.FromDate)
                .NotEmpty().WithMessage("Start Date can not be empty.");

            RuleFor(x => x.ToDate)
                .NotEmpty().WithMessage("End Date can not be empty.")
                .GreaterThanOrEqualTo(x => x.FromDate).WithMessage("End Date must be greater than Start Date.")
                .LessThanOrEqualTo(x => DateTime.Now.Date).WithMessage("End Date can not greater than today.");
        }
    }
}
