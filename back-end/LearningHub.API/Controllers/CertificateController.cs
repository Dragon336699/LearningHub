using LearningHub.API.Contracts.Certificates;
using LearningHub.API.Extensions;
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
        public CertificateController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateCertificate([FromForm] CreateCertificateRequest request, Guid testUserId)
        {
            CreateCertificateCommand createCertificateCommand = request.ToCreateCertificateCommand();
            await _certificateService.CreateCertificateAsync(createCertificateCommand, testUserId);
            return Ok();
        }

        //[Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateCertificate([FromForm] UpdateCertificateRequest request, Guid testUserId)
        {
            UpdateCertificateCommand createCertificateCommand = request.ToUpdateCertificateCommand();
            await _certificateService.UpdateCertificateAsync(createCertificateCommand, testUserId);
            return Ok();
        }

        //[Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteCertificate(Guid certificateId)
        {
            await _certificateService.DeleteCertificate(certificateId);
            return Ok();
        }
    }
}