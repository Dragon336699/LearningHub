using LearningHub.Application.Common.Constants;
using LearningHub.Domain.Constants;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace LearningHub.Application.Utils;

public static class TokenUtils
{
    public static Guid GetNameIdentifier(IHttpContextAccessor httpContextAccessor)
    {
        var userId = httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Guid.Empty;
        }
        return Guid.Parse(userId);
    }

    public static string GetRoleIdentifier(IHttpContextAccessor httpContextAccessor)
    {
        string? userRole = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

        return userRole switch
        {
            RoleName.Mentor => RoleName.Mentor,
            RoleName.Trainee => RoleName.Trainee,
            _ => throw new InvalidOperationException(Messages.Auth.InvalidRole)
        };
    }
}
