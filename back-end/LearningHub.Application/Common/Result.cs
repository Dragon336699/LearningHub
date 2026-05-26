namespace LearningHub.Application.Common
{
    public record Result<T>(bool IsSuccess, T? Data, List<string>? Errors)
    {
        public static Result<T> Success() => new(true, default, null);
        public static Result<T> Success(T data) => new(true, data, null);

        public static Result<T> Failure(List<string> errors) => new(false, default, errors);
    }
}
