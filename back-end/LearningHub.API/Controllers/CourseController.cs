using LearningHub.API.Contracts.Common;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        //[Authorize(Roles="Trainer")]
        [HttpPost]
        public async Task<IActionResult> CreateCourse(CreateCourseCommand command, Guid testUserId)
        {
            var validationResult = await _validationService.ValidateAsync(command);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<CourseDto> createResult = await _courseService.CreateNewCourseAsync(command, testUserId);

            if (!createResult.IsSuccess) return BadRequest(createResult);

            return Ok(createResult);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetPagedCourses([FromQuery] GetPageQuery query)
        {
            var validationResult = await _validationService.ValidateAsync(query);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<PagedResult<CourseDto>> getCoursesResult = await _courseService.GetPagedCourses(query.Page, query.PageSize);

            if (!getCoursesResult.IsSuccess) return BadRequest(getCoursesResult);

            return Ok(getCoursesResult);
        }

        //[Authorize]
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

        //[Authorize(Roles="Trainer")]
        [HttpPut]
        public async Task<IActionResult> UpdateCourse(UpdateCourseCommand command, Guid testUserId)
        {
            var validationResult = await _validationService.ValidateAsync(command);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<CourseDto> updateResult = await _courseService.UpdateCourseAsync(command, testUserId);

            if (!updateResult.IsSuccess) return BadRequest(updateResult);

            return Ok(updateResult);
        }

        //[Authorize(Roles="Admin")]
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

        //[Authorize(Roles="Trainer")]
        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourse(Guid courseId, Guid testUserId)
        {
            await _courseService.DeleteCourseAsync(courseId, testUserId);

            return NoContent();
        }
    }
}
