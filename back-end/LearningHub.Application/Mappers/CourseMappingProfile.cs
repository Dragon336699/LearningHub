using AutoMapper;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Mappers
{
    public class CourseMappingProfile : Profile
    {
        public CourseMappingProfile()
        {
            CreateMap<CreateCourseCommand, Course>();
            CreateMap<CourseDto, Course>();
            CreateMap<Course, CourseDto>();
        }
    }
}
