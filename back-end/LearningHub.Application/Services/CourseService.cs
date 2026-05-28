using AutoMapper;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Courses;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;

namespace LearningHub.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public CourseService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<CourseDto>> CreateNewCourseAsync(CreateCourseCommand command, Guid userId)
        {
            Course course = _mapper.Map<Course>(command);
            course.UserId = userId;

            await _unitOfWork.Courses.AddAsync(course);
            int rowAffected = await _unitOfWork.CompleteAsync();

            if (rowAffected == 0)
            {
                throw new Exception("No changes were saved");
            }

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        public async Task<Result<PagedResult<CourseDto>>> GetPagedCourses(int page, int pageSize)
        {
            List<Course> courses = await _unitOfWork.Courses.GetPagedAsync(page, pageSize);

            int totalCourses = await _unitOfWork.Courses.GetTotalItems(page, pageSize);

            List<CourseDto> coursesDto = _mapper.Map<List<CourseDto>>(courses);

            PagedResult<CourseDto> pageCourses = new PagedResult<CourseDto>
            {
                Items = coursesDto,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCourses
            };

            return Result<PagedResult<CourseDto>>.Success(pageCourses);
        }

        public async Task<Result<PagedResult<CourseDto>>> GetPublishedCourses(int page, int pageSize)
        {
            List<Course> courses = await _unitOfWork.Courses.GetPagedAsync(page, pageSize, c => c.Status == CourseStatus.Published);

            int totalCourses = await _unitOfWork.Courses.GetTotalItems(page, pageSize, c => c.Status == CourseStatus.Published);

            List<CourseDto> coursesDto = _mapper.Map<List<CourseDto>>(courses);

            PagedResult<CourseDto> pageCourses = new PagedResult<CourseDto>
            {
                Items = coursesDto,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCourses
            };

            return Result<PagedResult<CourseDto>>.Success(pageCourses);
        }

        public async Task<Result<CourseDto>> UpdateCourseAsync(UpdateCourseCommand command, Guid userId)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(command.Id);

            if (course == null)
            {
                throw new KeyNotFoundException($"Course with id {command.Id} not found.");
            }

            if (course.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this course.");
            }

            course.Title = command.Title;
            course.Description = command.Description;
            course.LearningObjectives = command.LearningObjectives;

            await _unitOfWork.CompleteAsync();

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        public async Task<Result<CourseDto>> UpdateCourseStatusAsync(UpdateCourseStatusCommand command)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(command.Id);

            if (course == null)
            {
                throw new KeyNotFoundException($"Course with id {command.Id} not found.");
            }

            course.Status = command.Status;

            await _unitOfWork.CompleteAsync();

            return Result<CourseDto>.Success(_mapper.Map<CourseDto>(course));
        }

        public async Task DeleteCourseAsync(Guid courseId, Guid userId)
        {
            Course? course = await _unitOfWork.Courses.GetByIdAsync(courseId);

            if (course == null)
            {
                throw new KeyNotFoundException($"Course with id {courseId} not found.");
            }

            if (course.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this course.");
            }

            _unitOfWork.Courses.Remove(course);
            await _unitOfWork.CompleteAsync();
        }
    }
}
