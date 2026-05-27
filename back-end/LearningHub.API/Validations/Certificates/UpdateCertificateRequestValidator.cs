using FluentValidation;
using LearningHub.API.Contracts.Certificates;

namespace LearningHub.API.Validations.Certificates
{
    public class UpdateCertificateRequestValidator : AbstractValidator<UpdateCertificateRequest>
    {
        private readonly string[] _allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
        public UpdateCertificateRequestValidator()
        {
            RuleFor(x => x.CertificateName)
            .NotEmpty()
            .MaximumLength(200);

            RuleFor(x => x.Organization)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.IssueDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("Issue date cannot be in the future.");

            RuleFor(x => x.ExpirationDate)
                .GreaterThan(x => x.IssueDate)
                .When(x => x.ExpirationDate.HasValue)
                .WithMessage("Expiration date must be after issue date.");

            RuleFor(x => x.CredentialFile)
                .Must(BeValidFileExtensions)
                .When(x => x.CredentialFile != null)
                .WithMessage("Only pdf, jpg, jpeg, png files are allowed.");

            RuleFor(x => x.CredentialFile)
                .Must(BeValidFileSize)
                .When(x => x.CredentialFile != null)
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
