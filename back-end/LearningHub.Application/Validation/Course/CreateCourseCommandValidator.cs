using FluentValidation;
using LearningHub.Application.Dtos.Courses;

namespace LearningHub.Application.Validation.Course
{
    public class CreateCourseCommandValidator : AbstractValidator<CreateCourseCommand>
    {
        public CreateCourseCommandValidator()
        {
            RuleFor(c => c.Title)
                .NotEmpty()
                .Must(t => !string.IsNullOrWhiteSpace(t))
                .WithMessage("Course title is required.")
                .MaximumLength(100)
                .WithMessage("Course title must not exceed 100 characters.");

            RuleFor(c => c.Description)
                .NotEmpty()
                .Must(d => !string.IsNullOrWhiteSpace(d))
                .WithMessage("Description is required.")
                .MaximumLength(500)
                .WithMessage("Description must not exceed 500 characters.");

            RuleFor(c => c.LearningObjectives)
                .MaximumLength(200)
                .WithMessage("Learning objectives must not exceed 200 characters.");
        }
    }
}
