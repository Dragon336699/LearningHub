using LearningHub.API.Contracts.Users;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Dtos.Users;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IValidationService _validationService;
        public UserController(IUserService userService, IValidationService validationService)
        {
            _userService = userService;
            _validationService = validationService;
        }

        //[Authorize]
        [HttpGet]
        [Route("profile")]
        public async Task<IActionResult> GetUserProfile(Guid testUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //}
            var userDto = await _userService.GetUserProfile(testUserId);
            return Ok(userDto);
        }

        //[Authorize]
        [HttpGet]
        [Route("profile/filter")]
        public async Task<IActionResult> SearchUsersProfile([FromQuery] SearchUserProfileCommand request)
        {
            var userDto = await _userService.SearchUserProfile(request);
            return Ok(userDto);
        }

        //[Authorize]
        [HttpPut]
        [Route("profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileCommand request, Guid testUserId)
        {
            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //}
            Result<UserDto> updateResult = await _userService.UpdateUserProfile(request, testUserId);

            if (!updateResult.IsSuccess)
            {
                return BadRequest(updateResult);
            }

            return Ok(updateResult);
        }


        // AVATAR //

        //[Authorize]
        [HttpPost]
        [Route("profile/avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarRequest request, Guid testUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //} 

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

            Result<UploadAvatarResponse> response = await _userService.UploadAvatarFile(avatarFileUpload, testUserId);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize]
        [HttpDelete]
        [Route("profile/avatar")]
        public async Task<IActionResult> DeleteAvatar(Guid testUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //} 

            Result<string> result = await _userService.DeleteAvatar(testUserId);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return NoContent();
        }

        //[Authorize]
        [HttpPost]
        [Route("profile/status")]
        public async Task<IActionResult> ChangeUserStatus([FromBody] UpdateUserStatusCommand request, Guid testUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //} 

            var validationResult = await _validationService.ValidateAsync(request);

            if (!validationResult.IsSuccess)
            {
                return BadRequest(validationResult);
            }

            Result<string> result = await _userService.ChangeUserStatus(request, testUserId);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return NoContent();
        }
    }
}
