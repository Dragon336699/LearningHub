using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Expertises;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("expertise")]
    public class ExpertiseController : ControllerBase
    {
        private readonly IExpertiseService _expertiseService;
        public ExpertiseController(IExpertiseService expertiseService)
        {
            _expertiseService = expertiseService;
        }

        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllExpertieses()
        {
            Result<List<ExpertiseDto>> result = await _expertiseService.GetAllExpertisesAsync();

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
