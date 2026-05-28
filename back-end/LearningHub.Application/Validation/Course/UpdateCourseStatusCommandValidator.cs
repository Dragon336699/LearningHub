using FluentValidation;
using LearningHub.Application.Dtos.Courses;

namespace LearningHub.Application.Validation.Course
{
    public class UpdateCourseStatusCommandValidator : AbstractValidator<UpdateCourseStatusCommand>
    {
        public UpdateCourseStatusCommandValidator()
        {
            RuleFor(c => c.Id)
                .NotEmpty()
                .WithMessage("Course ID is required.");

            RuleFor(c => c.Status)
                .IsInEnum()
                .WithMessage("Status must be a valid enum value.");
        }
    }
}
