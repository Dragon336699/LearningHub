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
        public DateTime? AssignedAt { get; set; }
        public int Progress { get; set; }

        public string TrainingStatus
        {
            get
            {
                if (!IsEnrolled) return "Not Enrolled";
                if (Progress == 0) return "Enrolled";
                if (Progress > 0 && Progress < 100) return "In Progress";
                return "Completed";
            }
        }
    }
}