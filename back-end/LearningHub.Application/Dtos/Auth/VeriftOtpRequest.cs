namespace LearningHub.Application.Dtos.Auth;

public class VerifyOtpRequestDto
{
    public string Email { get; init; }
    public string OtpCode { get; init; }
}