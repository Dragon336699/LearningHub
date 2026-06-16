using FluentValidation;
using LearningHub.Application.Dtos.BookingSession;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Validation.BookingSession
{
    public class GetSessionRequestValidator : AbstractValidator<GetSessionsRequest>
    {
        public GetSessionRequestValidator()
        {

            RuleFor(rq => rq.Date)
                .NotEmpty().WithMessage("Date is required");
        }
    }
}
