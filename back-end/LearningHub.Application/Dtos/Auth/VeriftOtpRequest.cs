namespace LearningHub.Application.Dtos.Auth;

public class VerifyEmailRequest
{
    public string Email { get; init; }
    public string Token { get; set; }
}