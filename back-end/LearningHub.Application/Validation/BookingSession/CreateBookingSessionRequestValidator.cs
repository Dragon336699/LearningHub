using FluentValidation;
using LearningHub.Application.Dtos.BookingSession;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Validation.BookingSession
{
    public class CreateBookingSessionRequestValidator : AbstractValidator<CreateBookingSessionRequest>
    {
        public CreateBookingSessionRequestValidator()
        {
            RuleFor(rq => rq.MentorId)
                .NotEmpty().WithMessage("MentorId is required");

            RuleFor(rq => rq.StartTime)
                .NotEmpty().WithMessage("StartTime is required")
                .GreaterThan(DateTime.Now).WithMessage("StartTime must be in the future");

            RuleFor(rq => rq.EndTime)
                .NotEmpty().WithMessage("EndTime is required")
                .GreaterThan(rq => rq.StartTime).WithMessage("EndTime must be after StartTime");
            
            RuleFor(rq => rq.SessionType)
                .NotEmpty().WithMessage("SessionType is required");
            
        }
    }
}
