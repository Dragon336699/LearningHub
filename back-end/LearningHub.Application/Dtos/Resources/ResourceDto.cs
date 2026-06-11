using LearningHub.Application.Dtos.Courses;

namespace LearningHub.Application.Dtos.Resources
{
    public class ResourceDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Url { get; set; }
        public required CourseDto Course { get; set; }
    }
}
