using LearningHub.Application.Dtos.Users;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        //[Authorize]
        [HttpPost]
        [Route("profile")]
        public async Task<IActionResult> CreateUserProfile([FromBody] CreateUserProfileCommand request, Guid testUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //}
            await _userService.CreateUserProfile(request, testUserId);
            return Ok();
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
        [HttpPut]
        [Route("profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileCommand request, Guid testUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null)
            //{
            //    return BadRequest();
            //}
            await _userService.UpdateUserProfile(request, testUserId);
            return Ok();
        }
    }
}
