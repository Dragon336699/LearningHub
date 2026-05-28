using LearningHub.Application.Common;
using Microsoft.EntityFrameworkCore;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace LearningHub.Application.Services
{
    public class RoleService : IRoleService
    {

        private readonly RoleManager<Role> _roleManager;

        public RoleService(RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<Result<List<Role>>> GetRolesAsync()
        {
            List<Role> roles = await _roleManager.Roles
                .Where(r => r.Name != "Admin").ToListAsync();

            return Result<List<Role>>.Success(roles);
        }
    }
}
