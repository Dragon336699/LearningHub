namespace LearningHub.Application.Common.Constants;


public static class Messages
{
    public static class Auth
    {
        public const string UserAlreadyExists = "An account may already exist for this email. Please sign in or use a different email address.";
        public const string InvalidRole = "Invalid role selection.";
        public const string RoleNotFound = "Role does not exist.";
        public const string RegisterSuccess = "Register successfully!";
        public const string LogoutSuccess = "Logout success.";
        public const string InvalidCredentials = "Invalid email or password.";
        public const string EmailNotConfirmed = "We've sent a verification link to your email. Please verify your account before signing in.";
        public const string InvalidLink = "Invalid verification link.";
        public const string LinkExpired = "Verification link has expired. Please request a new one.";
        public const string LinkInvalid = "Verification link is invalid. It may have been replaced by a newer link.";
        public const string UserNotFound = "User does not exist.";
        public const string AlreadyVerified = "This email has already been verified.";
        public const string EmailConfirmed = "Your email has been confirmed already.";
        public const string VerifySuccess = "Verify success! Please login to continue.";
        public const string EmailSent = "A new verification link has been sent to your email. Please check your inbox.";
        public const string RefreshTokenRequired = "Refresh Token is required.";
        public const string RefreshInvalidOrExpired = "Invalid or expired refresh token. Please login again.";
        public const string JwtKeyMissing = "JWT Secret Key is missing!";
    
    }


}