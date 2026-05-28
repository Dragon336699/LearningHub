using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Auth;
using LearningHub.Application.Interfaces;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
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

    public AuthService(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        ICacheService cacheService,
        IOtpService otpService,
        IConfiguration configuration,
        IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _cacheService = cacheService;
        _otpService = otpService;
        _configuration = configuration;
        _unitOfWork = unitOfWork;
        var durationStr = _configuration["JwtSettings:DurationInMinutes"];
        _jwtDurationInMinutes = double.TryParse(durationStr, out var minutes) ? minutes : 15;
    }

    public async Task<Result<string>> RegisterAsync(RegisterRequest request)
    {
        var userExists = await _userManager.FindByEmailAsync(request.Email);
        if (userExists != null)
        {
            return Result<string>.Failure(new List<string> { "Email already exists." });
        }

        string roleName = "Trainee";

        if (request.RoleId != Guid.Empty)
        {
            var targetRole = await _roleManager.FindByIdAsync(request.RoleId.ToString());
            if (targetRole == null)
            {
                return Result<string>.Failure(new List<string> { "Role does not exist." });
            }

            if (targetRole.Name!.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                return Result<string>.Failure(new List<string> { "Invalid role selection." });
            }

            roleName = targetRole.Name;
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

        var roleResult = await _userManager.AddToRoleAsync(newUser, roleName);
        if (!roleResult.Succeeded)
        {
            return Result<string>.Failure(roleResult.Errors.Select(e => e.Description).ToList());
        }

        await _unitOfWork.CompleteAsync();
        
        await GenerateAndSendOtpAsync(newUser, "Confirm your account - LearningHub", "Welcome to LearningHub!");

        return Result<string>.Success("Register Success. Please check your email to verify OTP.");
    }

    public async Task<Result<string>> VerifyOtpAsync(VerifyOtpRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Result<string>.Failure(new List<string> { "User does not exist." });
        }

        if (user.EmailConfirmed)
        {
            return Result<string>.Success("Your email has been confirmed already.");
        }

        string cacheKey = $"otp:{user.Id}";
        var savedOtp = await _cacheService.GetAsync<string>(cacheKey);

        if (savedOtp == null)
        {
            return Result<string>.Failure(new List<string> { "OTP expired. Please request a new one." });
        }

        if (savedOtp != request.OtpCode)
        {
            return Result<string>.Failure(new List<string> { "Invalid OTP." });
        }

        user.EmailConfirmed = true;
        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
        {
            return Result<string>.Failure(updateResult.Errors.Select(e => e.Description).ToList());
        }

        await _unitOfWork.CompleteAsync();

        await _cacheService.RemoveAsync(cacheKey);

        return Result<string>.Success("Verify success! Please login to continue.");
    }

    public async Task<Result<string>> ResendOtpAsync(ResendOtpRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Result<string>.Failure(new List<string> { "User does not exist." });
        }

        if (user.EmailConfirmed)
        {
            return Result<string>.Failure(new List<string> { "This email has already been verified." });
        }

        await GenerateAndSendOtpAsync(user, "Your new OTP - LearningHub", "LearningHub - Request Resend OTP");

        return Result<string>.Success("A new OTP has been sent to your email. Please check your inbox.");
    }

    private async Task GenerateAndSendOtpAsync(User user, string emailSubject, string titleHeader)
    {
        var otpCode = new Random().Next(100000, 999999).ToString();

        string cacheKey = $"otp:{user.Id}";
        await _cacheService.SetAsync(cacheKey, otpCode, TimeSpan.FromMinutes(15));

        var emailBody = $@"
            <h3>{titleHeader}</h3>
            <p>Your OTP is: <strong>{otpCode}</strong></p>
            <p>This OTP will expire in 15 minutes. Please do not share this email with anyone.</p>";

        _ = _otpService.SendOtpAsync(user.Email!, emailSubject, emailBody);
    }

    public async Task<Result<string>> RefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result<string>.Failure(new List<string> { "Refresh Token is required." });
        }
        var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return Result<string>.Failure(new List<string> { "Invalid or expired refresh token. Please login again." });
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        string newAccessToken = GenerateJwtToken(user, userRoles);

        return Result<string>.Success(newAccessToken);
    }

    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.EmailConfirmed || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Result<LoginResponse>.Failure(new List<string> { "Invalid email or password." });
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

        await _unitOfWork.CompleteAsync();

        return Result<LoginResponse>.Success(new LoginResponse
        {
            UserId = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt= DateTime.UtcNow.AddMinutes(_jwtDurationInMinutes),
            RefreshTokenExpiresAt = user.RefreshTokenExpiryTime.Value
        });
    }

    public async Task<Result<string>> LogoutAsync(string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result<string>.Failure(new List<string> { "Refresh Token is required." });
        }

        var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return Result<string>.Failure(updateResult.Errors.Select(e => e.Description).ToList());
            }
        }

        return Result<string>.Success("Logout success.");
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

        var secretKey = _configuration["JwtSettings:SecretKey"]
            ?? throw new ArgumentNullException("JWT Secret Key is missing!");

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var tokenDescription = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(authClaims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtDurationInMinutes),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescription);

        return tokenHandler.WriteToken(token);
    }
}