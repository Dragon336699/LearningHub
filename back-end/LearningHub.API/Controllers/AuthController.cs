using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Auth;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;

namespace LearningHub.API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IValidationService _validationService;

    public AuthController(IAuthService authService, IValidationService validationService)
    {
        _authService = authService;
        _validationService = validationService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var validationResult = await _validationService.ValidateAsync(request);

        if (!validationResult.IsSuccess)
        {
            return BadRequest(validationResult);
        }

        Result<string> result = await _authService.RegisterAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        Result<string> result = await _authService.VerifyEmailAsync(request
        );

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("resend-verification-email")]
    public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerifyRequest request)
    {
        if(!MailAddress.TryCreate(request.Email, out _))
        {
            return BadRequest(Result<string>.Failure(new List<string> { "Invalid email format." }));
        }
        
        var result = await _authService.ResendVerificationEmailAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        Result<LoginResponse> result = await _authService.LoginAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new { isSuccess = false, errors = result.Errors });
        }

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, 
            SameSite = SameSiteMode.None,
            Expires = result.Data.RefreshTokenExpiresAt 
        };

        Response.Cookies.Append("X-Access-Token", result.Data.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = result.Data.AccessTokenExpiresAt
        });

        Response.Cookies.Append("X-Refresh-Token", result.Data.RefreshToken, cookieOptions);

        return Ok(result);
    }

    [HttpPost("refresh-token")]
    [Authorize]
    public async Task<IActionResult> RefreshToken()
    {
        string refreshToken = Request.Cookies["X-Refresh-Token"] ?? string.Empty;

        Result<string> result = await _authService.RefreshTokenAsync(refreshToken);

        if (!result.IsSuccess)
        {
            return BadRequest(new { isSuccess = false, errors = result.Errors });
        }

        Response.Cookies.Append("X-Access-Token", result.Data, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        });

        return Ok();
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        string refreshToken = Request.Cookies["X-Refresh-Token"] ?? string.Empty;

        Result<string> result = await _authService.LogoutAsync(refreshToken);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None
        };

        Response.Cookies.Delete("X-Access-Token", cookieOptions);
        Response.Cookies.Delete("X-Refresh-Token", cookieOptions);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok();
    }
}