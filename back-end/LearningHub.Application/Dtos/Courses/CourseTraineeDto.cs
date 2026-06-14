namespace LearningHub.Application.Dtos.Courses
{
    public class CourseTraineeDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public bool IsEnrolled { get; set; }
        public Guid RoleId { get; set; }
        public string TrainingStatus { get; set; } = "Incomplete";
    }
}