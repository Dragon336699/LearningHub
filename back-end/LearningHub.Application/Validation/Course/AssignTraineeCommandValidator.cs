using FluentValidation;
using LearningHub.Application.Dtos.Courses;

namespace LearningHub.Application.Validators.Courses
{
    public class AssignTraineesCommandValidator : AbstractValidator<AssignTraineesCommand>
    {
        public AssignTraineesCommandValidator()
        {
            RuleFor(x => x.CourseId)
                .NotEmpty().WithMessage("Course ID is required.");

            RuleFor(x => x.TraineeIds)
                .NotEmpty().WithMessage("You must select at least one trainee to assign.")
                .Must(ids => ids != null && ids.Count > 0).WithMessage("Trainees list cannot be empty.");
        }
    }
}