
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserProfile(Guid userId);
        Task UpdateUserProfile(UpdateUserProfileCommand command, Guid userId);
        Task<List<UserDto>> SearchUserProfile(SearchUserProfileCommand command);
        Task<Result<UploadAvatarResponse>> UploadAvatarFile(FileUploadDto avatarFileUpload, Guid userId);
        Task<Result<string>> DeleteAvatar(Guid userId);
        Task<Result<string>> ChangeUserStatus(UpdateUserStatusCommand command, Guid userId);
    }
}
