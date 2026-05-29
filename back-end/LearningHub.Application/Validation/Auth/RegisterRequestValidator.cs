using FluentValidation;
using LearningHub.Application.Dtos.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Validation.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(rq => rq.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(rq => rq.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters")
            .MaximumLength(32).WithMessage("Password must be at most 32 characters")
            .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$")
            .WithMessage("Passwords must include uppercase letters, lowercase letters, numbers, and special characters.");

        RuleFor(rq => rq.ConfirmPassword)
                .NotEmpty().WithMessage("Please confirm password")
                .Equal(rq => rq.Password).WithMessage("Confirmation password does not match");

        RuleFor(rq => rq.RoleName)
            .NotEmpty().WithMessage("Role is required");
    }
}