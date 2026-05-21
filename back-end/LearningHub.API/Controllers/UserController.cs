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

        [Authorize]
        [HttpPost]
        [Route("profile")]
        public async Task<IActionResult> CreateUserProfile([FromBody] CreateUserProfileCommand request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return BadRequest();
            }
            await _userService.CreateUserProfile(request, Guid.Parse(userId));
            return Ok();
        }
    }
}
