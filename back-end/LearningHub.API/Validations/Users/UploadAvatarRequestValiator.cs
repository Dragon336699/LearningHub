using FluentValidation;
using LearningHub.API.Contracts.Users;

namespace LearningHub.API.Validations.Users
{
    public class UploadAvatarRequestValiator : AbstractValidator<UploadAvatarRequest>
    {
        private readonly string[] _allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
        public UploadAvatarRequestValiator()
        {
            RuleFor(u => u.AvatarFile)
                .Must(BeValidFileExtensions)
                .When(u => u.AvatarFile != null)
                .WithMessage("Only pdf, jpg, jpeg, png files are allowed.");

            RuleFor(u => u.AvatarFile)
                .Must(BeValidFileSize)
                .When(u => u.AvatarFile != null)
                .WithMessage("File size must not exceed 5MB and greater than 0 byte.");
        }

        private bool BeValidFileExtensions(IFormFile? file)
        {
            if (file == null) return true;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            return _allowedExtensions.Contains(extension);
        }

        private bool BeValidFileSize(IFormFile? file)
        {
            if (file == null) return true;

            return file.Length <= 5 * 1024 * 1024 && file.Length > 0;
        }
    }
}
