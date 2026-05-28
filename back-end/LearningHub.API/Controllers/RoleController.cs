using LearningHub.Application.Common;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LearningHub.API.Controllers
{
    [Route("role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            Result<List<Role>> result= await _roleService.GetRolesAsync();
            return Ok(result);
        }

     
    }
}
