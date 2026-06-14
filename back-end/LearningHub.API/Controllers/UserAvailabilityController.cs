using Azure.Core;
using LearningHub.Application.Dtos.UserAvailabilities;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("availability")]
    public class UserAvailabilityController : ControllerBase
    {
        private readonly IUserAvailabilityService _userAvailabilitySettingService;
        private readonly IValidationService _validationService;
        public UserAvailabilityController(IUserAvailabilityService userAvailabilitySettingService, IValidationService validationService)
        {
            _userAvailabilitySettingService = userAvailabilitySettingService;
            _validationService = validationService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateUserAvailabilities([FromBody] UserAvailabilityCommand request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var validateResult = await _validationService.ValidateAsync(request);

            if (!validateResult.IsSuccess)
            {
                return BadRequest(validateResult);
            }

            var result = await _userAvailabilitySettingService.CreateUserAvailabilities(request.Availabilities, Guid.Parse(userId));
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserAvailabilities([FromQuery] GetUserAvailabilitiesQuery query)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var validateResult = await _validationService.ValidateAsync(query);

            if (!validateResult.IsSuccess)
            {
                return BadRequest(validateResult);
            }

            var result = await _userAvailabilitySettingService.GetUserAvailabilities(Guid.Parse(userId), query);
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}