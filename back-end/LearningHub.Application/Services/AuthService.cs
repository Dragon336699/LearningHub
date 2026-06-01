using LearningHub.Application.Common;
using LearningHub.Application.Common.Constants;
using LearningHub.Application.Dtos.Auth;
using LearningHub.Application.Interfaces;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims;
using System.Text;

namespace LearningHub.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly ICacheService _cacheService;
    private readonly IOtpService _otpService;
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly double _jwtDurationInMinutes;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _accessTokenCookieName = "X-Access-Token";
    private readonly string _refreshTokenCookieName = "X-Refresh-Token";
    private readonly string _jwtSecretKey;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    public AuthService(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        ICacheService cacheService,
        IOtpService otpService,
        IConfiguration configuration,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _cacheService = cacheService;
        _otpService = otpService;
        _configuration = configuration;
        _unitOfWork = unitOfWork;
        _jwtDurationInMinutes = _configuration.GetValue<double>("JwtSettings:DurationInMinutes", 15);
        _httpContextAccessor = httpContextAccessor;
        _jwtSecretKey = _configuration["JwtSettings:SecretKey"];
        _jwtIssuer = _configuration["JwtSettings:Issuer"];
        _jwtAudience = _configuration["JwtSettings:Audience"];

    }

    public async Task<Result<string>> RegisterAsync(RegisterRequest request)
    {
        var userExists = await _userManager.FindByEmailAsync(request.Email);
        if (userExists != null)
        {
            return Result<string>.Failure( Messages.Auth.UserAlreadyExists );
        }

        string roleName = string.IsNullOrWhiteSpace(request.RoleName) ? "Trainee" : request.RoleName;

        if (roleName.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            return Result<string>.Failure( Messages.Auth.InvalidRole );
        }

        var targetRole = await _roleManager.FindByNameAsync(roleName);
        if (targetRole == null)
        {
            return Result<string>.Failure(Messages.Auth.RoleNotFound );
        }

        var newUser = new User
        {
            Id = Guid.CreateVersion7(),
            UserName = request.Email,
            Email = request.Email,
            FirstName = "",
            EmailConfirmed = false,
            Status = UserStatus.Active
        };

        var createResult = await _userManager.CreateAsync(newUser, request.Password);
        if (!createResult.Succeeded)
        {
            return Result<string>.Failure(createResult.Errors.Select(e => e.Description).ToList());
        }

        var roleResult = await _userManager.AddToRoleAsync(newUser, targetRole.Name!);
        if (!roleResult.Succeeded)
        {
            return Result<string>.Failure(roleResult.Errors.Select(e => e.Description).ToList());
        }

        await _unitOfWork.CompleteAsync();

        await GenerateAndSendVerificationLinkAsync(newUser, "Confirm your account - LearningHub", "Welcome to LearningHub!");

        return Result<string>.Success(Messages.Auth.RegisterSuccess);
    }

    public async Task<Result<string>> VerifyEmailAsync(VerifyEmailRequest request)
{
    if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Token))
    {
        return Result<string>.Failure(Messages.Auth.InvalidLink);
    }

    string cacheKey = $"verify:{request.Email}";
    var savedToken = await _cacheService.GetAsync<string>(cacheKey);

    if (string.IsNullOrEmpty(savedToken))
    {
        return Result<string>.Failure(Messages.Auth.LinkExpired);
    }

    if (savedToken != request.Token)
    {
        return Result<string>.Failure(Messages.Auth.LinkInvalid);
    }

    var user = await _userManager.FindByEmailAsync(request.Email);
    if (user == null) return Result<string>.Failure(Messages.Auth.UserNotFound);
    if (user.EmailConfirmed) return Result<string>.Success(Messages.Auth.EmailConfirmed);

    user.EmailConfirmed = true;
    var updateResult = await _userManager.UpdateAsync(user);
    if (!updateResult.Succeeded) return Result<string>.Failure(updateResult.Errors.Select(e => e.Description).ToList());


    await _cacheService.RemoveAsync(cacheKey);

    return Result<string>.Success(Messages.Auth.VerifySuccess);
}

    public async Task<Result<string>> ResendVerificationEmailAsync(ResendVerifyRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Result<string>.Failure(Messages.Auth.UserNotFound);
        }

        if (user.EmailConfirmed)
        {
            return Result<string>.Failure(Messages.Auth.EmailConfirmed);
        }

        await GenerateAndSendVerificationLinkAsync(user, "Your new verification link - LearningHub", "LearningHub - Verify Your Email");

        return Result<string>.Success(Messages.Auth.EmailSent);
    }

    private async Task GenerateAndSendVerificationLinkAsync(User user, string emailSubject, string titleHeader)
{
    string verificationToken = Guid.NewGuid().ToString("N");

    string cacheKey = $"verify:{user.Email}";

    await _cacheService.SetAsync(cacheKey, verificationToken, TimeSpan.FromMinutes(15));

    var clientUrl = _configuration["ClientUrl"];
    
    var verifyLink = $"{clientUrl}/verify-email?email={user.Email}&token={verificationToken}";

    var emailBody = $@"
        <h3>{titleHeader}</h3>
        <p>Please click the link below to verify your account:</p>
        <p><a href='{verifyLink}'><strong>Verify My Account</strong></a></p>
        <p>This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>";

    _ = _otpService.SendOtpAsync(user.Email!, emailSubject, emailBody);
}

    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Result<LoginResponse>.Failure(Messages.Auth.InvalidCredentials);
        }

        if (!user.EmailConfirmed)
        {
            await GenerateAndSendVerificationLinkAsync(user, "Your new verification link - LearningHub", "LearningHub - Verify Your Email");
            return Result<LoginResponse>.Failure(Messages.Auth.EmailSent);
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        string accessToken = GenerateJwtToken(user, userRoles);

        string refreshToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return Result<LoginResponse>.Failure(updateResult.Errors.Select(e => e.Description).ToList());
        }

        var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtDurationInMinutes);

        var responseCookies = _httpContextAccessor.HttpContext.Response.Cookies;

        responseCookies.Append(_accessTokenCookieName, accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = accessTokenExpiry
        });

        responseCookies.Append(_refreshTokenCookieName, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = user.RefreshTokenExpiryTime.Value
        });

        return Result<LoginResponse>.Success(new LoginResponse
        {
            UserId = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(_jwtDurationInMinutes),
            RefreshTokenExpiresAt = user.RefreshTokenExpiryTime.Value
        });
    }

    public async Task<Result<string>> RefreshTokenAsync()
    {
        string refreshToken = _httpContextAccessor.HttpContext.Request.Cookies[_refreshTokenCookieName] ?? string.Empty;
        var responseCookies = _httpContextAccessor.HttpContext.Response.Cookies;
      
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result<string>.Failure(Messages.Auth.RefreshTokenRequired);
        }
        var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return Result<string>.Failure(Messages.Auth.RefreshInvalidOrExpired);
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        string newAccessToken = GenerateJwtToken(user, userRoles);
        responseCookies.Append(_accessTokenCookieName, newAccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(_jwtDurationInMinutes)
        });

        return Result<string>.Success(newAccessToken);
    }


    public async Task<Result<string>> LogoutAsync()
    {
        string refreshToken = _httpContextAccessor.HttpContext.Request.Cookies[_refreshTokenCookieName] ?? string.Empty;
        var responseCookies = _httpContextAccessor.HttpContext.Response.Cookies;
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result<string>.Failure(Messages.Auth.RefreshTokenRequired);
        }

        User? user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return Result<string>.Failure(updateResult.Errors.Select(e => e.Description).ToList());
            }

            responseCookies.Delete(_accessTokenCookieName);
            responseCookies.Delete(_refreshTokenCookieName);
        }

        return Result<string>.Success(Messages.Auth.LogoutSuccess);
    }


    private string GenerateJwtToken(User user, IList<string> roles)
    {
        var authClaims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

        foreach (var role in roles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecretKey));

        var tokenDescription = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(authClaims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtDurationInMinutes),
            Issuer = _jwtIssuer,
            Audience = _jwtAudience,
            SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescription);

        return tokenHandler.WriteToken(token);
    }
}