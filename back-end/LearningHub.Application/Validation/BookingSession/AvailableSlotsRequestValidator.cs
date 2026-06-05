using FluentValidation;
using LearningHub.Application.Dtos.BookingSession;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Validation.BookingSession
{
    public class AvailableSlotsRequestValidator : AbstractValidator<AvailableSlotsRequest>
    {
        public AvailableSlotsRequestValidator()
        {
            RuleFor(rq=> rq.MentorId)
                .NotEmpty().WithMessage("MentorId is required");

            RuleFor(rq => rq.Date)
                .NotEmpty().WithMessage("Date is required");

            RuleFor(rq => rq.DurationType) 
                .NotEmpty().WithMessage("DurationType is required");

        }
    }
}
