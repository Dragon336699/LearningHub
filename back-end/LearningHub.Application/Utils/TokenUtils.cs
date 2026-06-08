using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

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
}
