using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace LearningHub.Infrastructure.Services
{
    public class FileStorageService : Application.Interfaces.Services.IFileStorageService
    {
        private readonly IConfiguration _configuration;
        public FileStorageService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<List<string>?> UploadFilesAsync(List<FileUploadDto> filesUploadDto, string folderName)
        {
            List<string> uploadUrls = new List<string>();
            var cloudinaryApi = _configuration.GetRequiredSection("Cloudinary");
            string? apiKey = cloudinaryApi["Api"];

            var cloudinary = new Cloudinary(apiKey);
            foreach (FileUploadDto fileInfo in filesUploadDto)
            {
                UploadResult? uploadResult = null;

                var uploadParams = fileInfo.ContentType.StartsWith("image/")
                    ? new ImageUploadParams
                    {
                        File = new FileDescription(fileInfo.FileName, fileInfo.Content),
                        Folder = folderName,
                        UseFilename = false,
                        UniqueFilename = true
                    } : new RawUploadParams
                    {
                        File = new FileDescription(fileInfo.FileName, fileInfo.Content),
                        Folder = folderName,
                        UseFilename = false,
                        UniqueFilename = true
                    };

                uploadResult = await cloudinary.UploadAsync(uploadParams);

                if (uploadResult == null || uploadResult.Error != null)
                {
                    return null;
                }

                uploadUrls.Add(uploadResult.SecureUrl.ToString());
            }

            return uploadUrls;
        }

        public async Task<string?> UploadFileAsync(FileUploadDto fileUploadDto, string folderName)
        {
            string? uploadUrl = null;
            var cloudinaryApi = _configuration.GetRequiredSection("Cloudinary");
            string? apiKey = cloudinaryApi["Api"];

            var cloudinary = new Cloudinary(apiKey);
            UploadResult? uploadResult = null;

            var uploadParams = fileUploadDto.ContentType.StartsWith("image/")
                ? new ImageUploadParams
                {
                    File = new FileDescription(fileUploadDto.FileName, fileUploadDto.Content),
                    Folder = folderName,
                    UseFilename = false,
                    UniqueFilename = true
                } : new RawUploadParams
                {
                    File = new FileDescription(fileUploadDto.FileName, fileUploadDto.Content),
                    Folder = folderName,
                    UseFilename = false,
                    UniqueFilename = true
                };

            uploadResult = await cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                return null;
            }
            if (uploadResult != null) uploadUrl = uploadResult.SecureUrl.ToString();

            return uploadUrl;
        }
    }
}
