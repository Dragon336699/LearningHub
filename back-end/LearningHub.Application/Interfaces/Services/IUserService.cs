
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Dtos.Users;

namespace LearningHub.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<Result<UserDto>> GetUserProfile(Guid userId);
        Task<Result<UserDto>> UpdateUserProfile(UpdateUserProfileCommand command, Guid userId);
        Task<Result<List<UserDto>>> SearchUserProfile(SearchUserProfileCommand command);
        Task<Result<UploadAvatarResponse>> UploadAvatarFile(FileUploadDto avatarFileUpload, Guid userId);
        Task<Result<string>> DeleteAvatar(Guid userId);
        Task<Result<string>> ChangeUserStatus(UpdateUserStatusCommand command, Guid userId);
        Task<Result<PagedResult<UserDto>>> GetAllUsersForManagementAsync(int page, int pageSize, string? keyword);
        Task<Result<List<UserDto>>> GetAllTraineesAsync();
    }
}
