using LearningHub.API.Contracts.Resource;
using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Dtos.Resources;

namespace LearningHub.API.Extensions
{
    public static class ResourceExtension
    {
        public static CreateResourceCommand ToCreateResourceCommand(this CreateResourceRequest request)
        {
            FileUploadDto fileUpload = new FileUploadDto
            {
                Content = request.File.OpenReadStream(),
                FileName = request.File.FileName,
                ContentType = request.File.ContentType
            };

            return new CreateResourceCommand
            {
                Title = request.Title,
                Description = request.Description,
                CourseId = request.CourseId,
                ResourceFile = fileUpload
            };
        }

        public static UpdateResourceCommand ToUpdateResourceCommand(this UpdateResourceRequest request)
        {
            FileUploadDto? fileUpload = null;
            if (request.File != null)
            {
                fileUpload = new FileUploadDto
                {
                    Content = request.File.OpenReadStream(),
                    FileName = request.File.FileName,
                    ContentType = request.File.ContentType
                };
            }

            return new UpdateResourceCommand
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                CourseId = request.CourseId,
                ResourceFile = fileUpload
            };
        }
    }
}
