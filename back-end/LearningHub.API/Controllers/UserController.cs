using LearningHub.API.Contracts.Common;
using LearningHub.API.Contracts.Users;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Dtos.Users;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IValidationService _validationService;
        public UserController(IUserService userService, IValidationService validationService)
        {
            _userService = userService;
            _validationService = validationService;
        }

        [Authorize]
        [HttpGet]
        [Route("profile")]
        public async Task<IActionResult> GetUserProfile(Guid userId)
        {
            Result<UserDto> result = await _userService.GetUserProfile(userId);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        [Route("profile/filter")]
        public async Task<IActionResult> SearchUsersProfile([FromQuery] SearchUserProfileCommand request)
        {
            var validationResult = await _validationService.ValidateAsync(request);
            
            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<List<UserDto>> result = await _userService.SearchUserProfile(request);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpPut]
        [Route("profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileCommand request)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return BadRequest();
            }
            Result<UserDto> updateResult = await _userService.UpdateUserProfile(request, Guid.Parse(userId));

            if (!updateResult.IsSuccess)
            {
                return BadRequest(updateResult);
            }

            return Ok(updateResult);
        }


        // AVATAR //

        [Authorize]
        [HttpPost]
        [Route("profile/avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return BadRequest();
            }

            if (request.AvatarFile == null || request.AvatarFile.Length == 0)
            {
                return BadRequest(Result<object>.Failure(new List<string> { "Avatar file is required" }));
            }

            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            FileUploadDto avatarFileUpload = new FileUploadDto
            {
                Content = request.AvatarFile.OpenReadStream(),
                ContentType = request.AvatarFile.ContentType,
                FileName = request.AvatarFile.FileName,
            };

            Result<UploadAvatarResponse> response = await _userService.UploadAvatarFile(avatarFileUpload, Guid.Parse(userId));

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [Authorize]
        [HttpDelete]
        [Route("profile/avatar")]
        public async Task<IActionResult> DeleteAvatar()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return BadRequest();
            }

            Result<string> result = await _userService.DeleteAvatar(Guid.Parse(userId));

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("profile/status")]
        public async Task<IActionResult> ChangeUserStatus([FromBody] UpdateUserStatusCommand request, [FromQuery] Guid userId)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<string> result = await _userService.ChangeUserStatus(request, userId);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("admin/users")]
        public async Task<IActionResult> GetAllUsersForManagement([FromQuery] GetPageQuery query, [FromQuery] string? keyword)
        {
            var validationResult = await _validationService.ValidateAsync(query);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<PagedResult<UserDto>> result = await _userService.GetAllUsersForManagementAsync(query.Page, query.PageSize, keyword);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [Authorize(Roles = "Mentor,Admin")]
        [HttpGet]
        [Route("trainees")]
        public async Task<IActionResult> GetAllTrainees()
        {
            Result<List<UserDto>> result = await _userService.GetAllTraineesAsync();

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

    }
}
