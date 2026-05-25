using LearningHub.Application.Dtos.Common;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<List<string>?> UploadFilesAsync(List<FileUploadDto> filesUploadDto, string folderName);
        Task<string?> UploadFileAsync(FileUploadDto fileUploadDto, string folderName);
    }
}
