namespace LearningHub.Application.Dtos.Auth;

public class RegisterRequest
{
    public string Email { get; init; }
    public string Password { get; init; }
    public string ConfirmPassword { get; init; }
    public Guid RoleId { get; init; } 
}

