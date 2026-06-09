using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("sessions")]
    public class BookingSessionController: ControllerBase
    {
        private readonly IBookingSessionService _bookingSessionService;
        private readonly IValidationService _validationService;

        public BookingSessionController(IBookingSessionService bookingSessionService, IValidationService validationService)
        {
            _bookingSessionService = bookingSessionService;
            _validationService = validationService;
        }

        [HttpPost]
        [Authorize(Policy = RoleName.Trainee)]
        public async Task<IActionResult> CreateSession([FromBody] CreateBookingSessionRequest request)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }
            var result = await _bookingSessionService.CreateBookingSessionAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(result); 
            }

            return Ok(result);
        }

        [HttpPut("approve/{id:guid}")]
        [Authorize(Policy = RoleName.Mentor)]
        public async Task<IActionResult> ApproveSession(Guid id)
        {
            var result = await _bookingSessionService.ApproveSessionAsync(id);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("cancel/{id:guid}")]
        [Authorize] 
        public async Task<IActionResult> CancelSession(Guid id)
        {
            var result = await _bookingSessionService.CancelSessionAsync(id);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("available-slots")]
        [Authorize]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] AvailableSlotsRequest request)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }
            var slots = await _bookingSessionService.GetAvailableSlotsAsync(request);
            return Ok(slots);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSessions([FromQuery] GetSessionsRequest request)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var result = await _bookingSessionService.GetBookingSessions(request);

            return Ok(result.Data);

        }
    }
}
