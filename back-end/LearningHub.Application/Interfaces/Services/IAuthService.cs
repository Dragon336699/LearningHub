using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Interfaces.Services;

public interface IAuthService
{
    Task<Result<string>> RegisterAsync(RegisterRequest request);
    Task<Result<string>> VerifyEmailAsync(VerifyEmailRequest request);
    Task<Result<string>> ResendVerificationEmailAsync(ResendVerifyRequest request);
    Task<Result<LoginResponse>> LoginAsync(LoginRequest request);
    Task<Result<string>> RefreshTokenAsync(string refreshToken);
    Task<Result<string>> LogoutAsync(string refreshToken);

}
