using FluentValidation;
using LearningHub.Application.Dtos.Courses;

namespace LearningHub.Application.Validation.Course
{
    public class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
    {
        public UpdateCourseCommandValidator()
        {
            RuleFor(c => c.Id)
                .NotEmpty()
                .WithMessage("Course ID is required.");

            RuleFor(c => c.Title)
                .Must(t => !string.IsNullOrWhiteSpace(t))
                .WithMessage("Course title is required.")
                .MaximumLength(100)
                .WithMessage("Course title must not exceed 100 characters.");

            RuleFor(c => c.Description)
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
