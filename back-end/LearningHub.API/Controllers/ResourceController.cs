using LearningHub.API.Contracts.Common;
using LearningHub.API.Contracts.Resource;
using LearningHub.API.Extensions;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("resource")]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceService _resourceService;
        private readonly IValidationService _validationService;
        public ResourceController(IResourceService resourceSerivce, IValidationService validationService)
        {
            _resourceService = resourceSerivce;
            _validationService = validationService;
        }

        [Authorize(Roles = "Mentor")]
        [HttpPost]
        public async Task<IActionResult> CreateResourceAsync([FromForm] CreateResourceRequest request)
        {
            var validationResult = await _validationService.ValidateAsync(request);
            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var result = await _resourceService.CreateResourceAsync(request.ToCreateResourceCommand());

            return StatusCode(StatusCodes.Status201Created, result);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetResourcesByTraineeAsync([FromQuery] GetPageQuery query, string? keyword)
        {
            var validationResult = await _validationService.ValidateAsync(query);
            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var result = await _resourceService.GetResourcesAsync(query.Page, query.PageSize, keyword ?? "");

            return Ok(result);
        }

        [Authorize(Roles = "Mentor")]
        [HttpGet]
        [Route("mentor")]
        public async Task<IActionResult> GetResourcesByMentorAsync([FromQuery] GetPageQuery query, string? keyword)
        {
            var validationResult = await _validationService.ValidateAsync(query);
            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var result = await _resourceService.GetResourcesByMentor(query.Page, query.PageSize, keyword ?? "");

            return Ok(result);
        }

        [Authorize(Roles = "Mentor")]
        [HttpPut]
        public async Task<IActionResult> UpdateResourceAsync([FromForm] UpdateResourceRequest request)
        {
            var validationResult = await _validationService.ValidateAsync(request);
            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var result = await _resourceService.UpdateResourceAsync(request.ToUpdateResourceCommand());

            return StatusCode(StatusCodes.Status201Created, result);
        }

        [Authorize(Roles = "Mentor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResourceAsync(Guid id)
        {
            await _resourceService.DeleteResourceAsync(id);
            return Ok();
        }
    }
}
