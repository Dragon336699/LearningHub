using LearningHub.API.Contracts.Users;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearningHub.API.Controllers
{
    [ApiController]
    [Route("user/profile")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserProfile([FromBody] CreateUserProfileCommand request)
        {
            await _userService.CreateUserProfile(request);
            return Ok();
        }
    }
}
