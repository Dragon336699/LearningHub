using LearningHub.API.Contracts.Common;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("courses")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IValidationService _validationService;
        public CourseController(ICourseService courseService, IValidationService validationService)
        {
            _courseService = courseService;
            _validationService = validationService;
        }

        [Authorize(Roles="Mentor")]
        [HttpPost]
        public async Task<IActionResult> CreateCourse(CreateCourseCommand command)
        {
            var validationResult = await _validationService.ValidateAsync(command);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized(Result<string>.Failure(new List<string> { "Invalid access token." }));
            }

            Result<CourseDto> createResult = await _courseService.CreateNewCourseAsync(command, Guid.Parse(userId));

            if (!createResult.IsSuccess) return BadRequest(createResult);

            return Ok(createResult);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetPagedAllCourses([FromQuery] GetPageQuery query)
        {
            var validationResult = await _validationService.ValidateAsync(query);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<PagedResult<CourseDto>> getCoursesResult = await _courseService.GetPagedAllCourses(query.Page, query.PageSize);

            if (!getCoursesResult.IsSuccess) return BadRequest(getCoursesResult);

            return Ok(getCoursesResult);
        }

        [Authorize(Roles = "Mentor")]
        [HttpGet]
        [Route("mentor")]
        public async Task<IActionResult> GetCoursesByMentor([FromQuery] GetPageQuery query)
        {
            var validationResult = await _validationService.ValidateAsync(query);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized(Result<string>.Failure(new List<string> { "Invalid access token." }));
            }

            Result<PagedResult<CourseDto>> getCoursesResult = await _courseService.GetCoursesByMentor(query.Page, query.PageSize, Guid.Parse(userId));

            if (!getCoursesResult.IsSuccess) return BadRequest(getCoursesResult);

            return Ok(getCoursesResult);
        }

        [Authorize]
        [HttpGet]
        [Route("published")]
        public async Task<IActionResult> GetPublishedCourses([FromQuery] GetPageQuery query)
        {
            var validationResult = await _validationService.ValidateAsync(query);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<PagedResult<CourseDto>> getCoursesResult = await _courseService.GetPublishedCourses(query.Page, query.PageSize);

            if (!getCoursesResult.IsSuccess) return BadRequest(getCoursesResult);

            return Ok(getCoursesResult);
        }

        [Authorize(Roles="Mentor")]
        [HttpPut]
        public async Task<IActionResult> UpdateCourse(UpdateCourseCommand command)
        {
            var validationResult = await _validationService.ValidateAsync(command);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized(Result<string>.Failure(new List<string> { "Invalid access token." }));
            }

            Result<CourseDto> updateResult = await _courseService.UpdateCourseAsync(command, Guid.Parse(userId));

            if (!updateResult.IsSuccess) return BadRequest(updateResult);

            return Ok(updateResult);
        }

        [Authorize(Roles="Admin")]
        [HttpPut]
        [Route("status")]
        public async Task<IActionResult> UpdateCourseStatus(UpdateCourseStatusCommand command)
        {
            var validationResult = await _validationService.ValidateAsync(command);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<CourseDto> updateResult = await _courseService.UpdateCourseStatusAsync(command);

            if (!updateResult.IsSuccess) return BadRequest(updateResult);

            return Ok(updateResult);
        }

        [Authorize(Roles="Mentor")]
        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourse(Guid courseId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized(Result<string>.Failure(new List<string> { "Invalid access token." }));
            }

            await _courseService.DeleteCourseAsync(courseId, Guid.Parse(userId));

            return NoContent();
        }
    }
}
