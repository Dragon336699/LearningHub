using LearningHub.Application.Dtos.DashboardSummaries;

namespace LearningHub.Application.Common.Constants;


public static class Messages
{
    public static class SystemError
    {
        public static string DefaultError(string message)
        {
            return $"An error occurred: {message}";
        }
    }

    public static class Auth
    {
        public const string UserAlreadyExists = "An account may already exist for this email. Please sign in or use a different email address.";
        public const string InvalidRole = "Invalid role.";
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
        public const string UserIndentifierMissing = "User identifier is missing in the token.";
        public const string ActionForbidden = "You do not have permission to perform this action.";
    }

    public static class ResourceMessage
    {
        public const string TitleRequired = "Title is required.";
        public const string TitleMaxLength = "Title must not exceed 100 characters.";
        public const string DescriptionRequired = "Description is required.";
        public const string DescriptionMaxLength = "Description must not exceed 500 characters.";
        public const string ResourceFileRequired = "Resource file is required.";
        public const string FileExtensionNotAllowed = "Invalid file type. Allowed types are: pdf, doc, docx, txt, mov, mp4.";
        public const string FileSizeInvalid = "Invalid file size. Videos must not exceed 10MB, documents must not exceed 5MB, and file size must be greater than 0 bytes.";
        public const string ResourceNotFound = "Resource not found.";
    }

    public static class BookingSession
    {
        public const string MentorNotFound = "Mentor not found";
        public const string MentorInvalid = "Mentor is invalid";
        public const string TraineeNotFound = "Trainee not found";
        public const string TraineeInvalid = "Trainee is invalid";
        public const string MentorAlreadyBusy = "The mentor already busy at this time.";
        public const string TraineeAlreadyBusy = "You are having another session in this time.";
        public const string CreateSuccess = "Booking session created successfully and waiting for mentor's approval.";

        public const string NotAuthorized = "You are not authorized to approve this session.";
        public const string NotFoundOrProcessed = "Session not found or already processed.";
        public const string CannotApproveMentorBusy = "Cannot approve this session because the mentor has another confirmed session at the same time.";
        public const string ApproveSuccess = "Session approved successfully. All other overlapping pending requests have been cancelled.";
        public const string ApproveExceptionPrefix = "An error occurred while approving the session: ";

        public const string CancelSuccess = "Session Cancelled successfully.";

    }

    public static class Email
    {
        //subject
        public const string NewRequestSubject = "New Session Booking Request";
        public const string ApprovedSubject = "Session Booking Approved";
        public const string CancelledSubject = "Session Booking Request Cancelled";

        //body 
        public static string CancelSessionBody(string date, string timeRange)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                    <h3 style='color: #e53e3e; margin-top: 0;'>❌ Session Booking Request Cancelled</h3>
                    <p>Dear Trainee,</p>
                    <p>We regret to inform you that your session booking request has been cancelled:</p>
            
                    <div style='background-color: #edf2f7; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 14px;'>
                        <p style='margin: 4px 0;'><strong>Date:</strong> {date}</p>
                        <p style='margin: 4px 0;'><strong>Time:</strong> {timeRange}</p>
                    </div>
                    <p>Please log back in to the system to book another available slot or select another mentor.</p>
            
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 11px; color: #a0aec0; text-align: center; margin: 0;'>This is an automated notification. Please do not reply directly to this email.</p>
                </div>";
        }

        public static string RequestSessionBody(string date, string timeRange)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                    <h3 style='color: #2b6cb0; margin-top: 0;'>🔔 Notification: New Session Booking Request</h3>
                    <p>Dear Mentor,</p>
                    <p>A trainee has submitted a new session booking request that is currently awaiting your review:</p>
            
                    <div style='background-color: #edf2f7; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 14px;'>
                        <p style='margin: 4px 0;'><strong>Date:</strong> {date}</p>
                        <p style='margin: 4px 0;'><strong>Time:</strong> {timeRange}</p>
                    </div>

                    <p>Please log in to the website and navigate to your <strong>Session Management</strong> page to review and process this request.</p>
            
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 11px; color: #a0aec0; text-align: center; margin: 0;'>This is an automated notification. Please do not reply directly to this email.</p>
                </div>";
        }

        public static string AprroveSessionBody(string date, string timeRange)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>
                    <h3 style='color: #2b6cb0; margin-top: 0;'>✅ Session Booking Approved</h3>
                    <p>Dear Trainee,</p>
                    <p>Your session booking request has been approved by the mentor. Here are the details of your upcoming session:</p>
            
                    <div style='background-color: #edf2f7; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 14px;'>
                        <p style='margin: 4px 0;'><strong>Date:</strong> {date}</p>
                        <p style='margin: 4px 0;'><strong>Time:</strong> {timeRange}</p>
                    </div>
                    <p>Please make sure to be prepared for the session and log in to the website a few minutes before the scheduled time.</p>
            
                    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                    <p style='font-size: 11px; color: #a0aec0; text-align: center; margin: 0;'>This is an automated notification. Please do not reply directly to this email.</p>
                </div>";
        }
    }

    public static class UploadFile
    {
        public const string UploadFailed = "File upload failed. Please try again.";
    }

    public static class Dashboard
    {
        public static ZenQuote DefaultQuote(){
            return new ZenQuote {
                Q= "Bright minds, deep dreams, wild love.",
                A= "Juki Stricker"

            };
        }
    }
}