namespace LearningHub.API.Common.Responses
{
    public class ErrorResponse
    {
        public bool Success { get; set; } = false;
        public int StatusCode {  get; set; }
        public string Message { get; set; } = null!;
        public List<string>? Errors { get; set; }
    }
}
