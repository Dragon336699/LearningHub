using LearningHub.Application.Dtos.BookingSession;
using LearningHub.Application.Dtos.DashboardSummaries;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Services;
using LearningHub.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("dashboard")] //dashboard is uncountable
    [Authorize]
    public class DashboardSummaryController:ControllerBase
    {
        private readonly IDashboardSummaryService _dashboardSummaryService;
        private readonly IValidationService _validationService;

        public DashboardSummaryController(IDashboardSummaryService dashboardSummaryService,
            IValidationService validationService)
        {
            _dashboardSummaryService = dashboardSummaryService;
            _validationService = validationService;
        }

        [HttpGet]
        [Authorize(Policy = RoleName.Admin)]
        public async Task<IActionResult> GetSessions([FromQuery] GetDashboardSummaryRequest request)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var result = await _dashboardSummaryService.GetByTimeRangeAsync(request);

            return Ok(result.Data);

        }
    }
}
