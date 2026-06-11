using FluentValidation;
using LearningHub.API.Contracts.Resource;
using LearningHub.Application.Common.Constants;

namespace LearningHub.API.Validations.Resources
{
    public class CreateResourceRequestValidator : AbstractValidator<CreateResourceRequest>
    {
        private readonly string[] _allowedExtensions = [".pdf", ".mp4", ".mov", ".doc", ".docx", ".txt"];
        public CreateResourceRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage(Messages.ResourceMessage.TitleRequired)
                .MaximumLength(100)
                .WithMessage(Messages.ResourceMessage.TitleMaxLength);

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage(Messages.ResourceMessage.DescriptionRequired)
                .MaximumLength(500)
                .WithMessage(Messages.ResourceMessage.DescriptionMaxLength);

            RuleFor(x => x.File)
                .NotNull()
                .WithMessage(Messages.ResourceMessage.ResourceFileRequired);

            RuleFor(x => x.File)
                .Must(BeValidFileExtensions)
                .WithMessage(Messages.ResourceMessage.FileExtensionNotAllowed);

            RuleFor(x => x.File)
               .Must(BeValidFileSize)
               .WithMessage(Messages.ResourceMessage.FileSizeInvalid);
        }

        private bool BeValidFileExtensions(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return _allowedExtensions.Contains(extension);
        }

        private bool BeValidFileSize(IFormFile file)
        {
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            int maxSizeInBytes;
            switch (extension) {
                case ".pdf" or ".doc" or "docx" or ".txt":
                    maxSizeInBytes = 5 * 1024 * 1024;
                    break;
                case ".mp4" or ".mov":
                    maxSizeInBytes = 10 * 1024 * 1024;
                    break;
                default:
                    maxSizeInBytes = 5 * 1024 * 1024;
                    break;

            }
            return file.Length > 0 && file.Length <= maxSizeInBytes;
        }
    }
}
