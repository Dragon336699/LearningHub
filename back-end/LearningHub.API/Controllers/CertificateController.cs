using LearningHub.API.Contracts.Certificates;
using LearningHub.API.Extensions;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Certificates;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("certificate")]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService _certificateService;
        private readonly IValidationService _validationService;
        public CertificateController(ICertificateService certificateService, IValidationService validationService)
        {
            _certificateService = certificateService;
            _validationService = validationService;
        }

        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateCertificate([FromForm] CreateCertificateRequest request, Guid testUserId)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            if (Request.Form.Files.Count > 1)
            {
                return BadRequest(Result<string>.Failure(new List<string> { "Only one file is allowed." }));
            }

            CreateCertificateCommand createCertificateCommand = request.ToCreateCertificateCommand();
            Result<CertificateDto> createResult = await _certificateService.CreateCertificateAsync(createCertificateCommand, testUserId);

            if (!createResult.IsSuccess)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }

        //[Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateCertificate([FromForm] UpdateCertificateRequest request, Guid testUserId)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            if (Request.Form.Files.Count > 1)
            {
                return BadRequest(Result<string>.Failure(new List<string> { "Only one file is allowed." }));
            }

            UpdateCertificateCommand createCertificateCommand = request.ToUpdateCertificateCommand();
            Result<CertificateDto> updateResult = await _certificateService.UpdateCertificateAsync(createCertificateCommand, testUserId);

            if (!updateResult.IsSuccess)
            {
                return BadRequest(updateResult);
            }

            return Ok(updateResult);
        }

        //[Authorize]
        [HttpDelete("{certificateId}")]
        public async Task<IActionResult> DeleteCertificate(Guid certificateId)
        {
            await _certificateService.DeleteCertificateAsync(certificateId);
            return NoContent();
        }
    }
}