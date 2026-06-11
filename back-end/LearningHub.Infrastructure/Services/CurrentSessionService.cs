using LearningHub.Application.Common.Constants;
using LearningHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace LearningHub.Infrastructure.Services
{
    public class CurrentSessionService : ICurrentSessionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CurrentSessionService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId
        {
            get
            {
                var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrWhiteSpace(userId))
                {
                    throw new UnauthorizedAccessException(Messages.Auth.UserIndentifierMissing);
                }

                return Guid.Parse(userId);
            }
        }
    }
}
