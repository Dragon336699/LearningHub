using AutoMapper;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Common;
using LearningHub.Application.Dtos.Users;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using LearningHub.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorageService;
        public UserService(IUnitOfWork unitOfWork, UserManager<User> userManager, IMapper mapper, IFileStorageService fileStorageService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
            _fileStorageService = fileStorageService;
        }

        //Read user profile

        public async Task<Result<UserDto>> GetUserProfile(Guid userId)
        {
            var user = await _userManager.Users
                .AsSplitQuery()
                .Include(u => u.Experiences)
                .Include(u => u.Expertises)
                .Include(u => u.Certificates)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var roleName = roles.FirstOrDefault();

            UserDto userDto = _mapper.Map<UserDto>(user);
            userDto.RoleName = roleName;

            return Result<UserDto>.Success(userDto);
        }

        //Search user profile 

        public async Task<Result<List<UserDto>>> SearchUserProfile(SearchUserProfileCommand command)
        {
            var mentors = await _userManager.GetUsersInRoleAsync("Mentor");

            IEnumerable<Guid> mentorsIds = mentors.Select(m => m.Id);

            mentors = await _unitOfWork.Users.GetMentorsByIdsAsync(mentorsIds);
            var userDtos = _mapper.Map<List<UserDto>>(mentors);

            foreach (var dto in userDtos)
            {
                var user = mentors.First(x => x.Id == dto.Id);

                var roles = await _userManager.GetRolesAsync(user);
                dto.RoleName = roles.FirstOrDefault();
            }

            if (string.IsNullOrEmpty(command.Keyword) && command.ExpertiseIds?.Count == 0)
            {
                return Result<List<UserDto>>.Success(userDtos);
            }

            List<Guid> expertiseIds = command.ExpertiseIds;

            var usersFilteredByKeyword = userDtos
                .Where(u => (u.FirstName.ToLower().Contains(command.Keyword.ToLower()) && !string.IsNullOrEmpty(u.FirstName)) || (u.LastName?.ToLower().Contains(command.Keyword.ToLower()) == true && !string.IsNullOrEmpty(u.LastName)));

            if (command.ExpertiseIds?.Count == 0)
            {
                return Result<List<UserDto>>.Success(usersFilteredByKeyword.ToList());
            }

            var usersFiltered = usersFilteredByKeyword.Where(u => u.Expertises.Any(e => expertiseIds.Contains(e.Id)));

            return Result<List<UserDto>>.Success(usersFiltered.ToList());
        }

        //Update user profile
        public async Task<Result<UserDto>> UpdateUserProfile(UpdateUserProfileCommand command, Guid userId)
        {
            var user = await _userManager.Users
                .Include(u => u.Expertises)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            if (await _userManager.IsInRoleAsync(user, "Mentor"))
            {
                user.CoachCost = command.CoachCost ?? 0;
            }

            user.FirstName = command.FirstName;
            user.LastName = command.LastName;
            user.Bio = command.Bio;
            user.Skills = command.Skills;

            //Update experiences
            var existingExperiences = await _unitOfWork.Experiences.FindAllAsync(ex => ex.UserId == userId);

            foreach (var expDto in command.Experiences)
            {
                var existExp = existingExperiences.FirstOrDefault(x => x.Id == expDto.Id);

                if (existExp != null)
                {
                    existExp.Title = expDto.Title;
                    existExp.Description = expDto.Description;
                    existExp.StartDate = DateOnly.FromDateTime(expDto.StartDate);
                    existExp.EndDate = DateOnly.FromDateTime(expDto.EndDate);
                }
                else
                {
                    await _unitOfWork.Experiences.AddAsync(new Experience
                    {
                        Title = expDto.Title,
                        Description = expDto.Description,
                        StartDate = DateOnly.FromDateTime(expDto.StartDate),
                        EndDate = DateOnly.FromDateTime(expDto.EndDate),
                        UserId = userId
                    });
                }
            }

            var requestExperienceIds = command.Experiences
                .Where(x => x.Id != null)
                .Select(x => x.Id);

            var deletedExperiences = existingExperiences.Where(x => !requestExperienceIds.Contains(x.Id));
            _unitOfWork.Experiences.RemoveRange(deletedExperiences);

            //Update expertises
            var expertises = await _unitOfWork.Expertises.GetByIdsAsync(command.Expertises);

            user.Expertises.Clear();
            user.Expertises = expertises;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new Exception("Update user profile failed");
            }
            await _unitOfWork.CompleteAsync();

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        // AVATAR //

        public async Task<Result<UploadAvatarResponse>> UploadAvatarFile(FileUploadDto avatarFileUpload, Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            string? avatarUrl = await _fileStorageService.UploadFileAsync(avatarFileUpload, "Avatar");

            if (avatarUrl == null)
            {
                throw new Exception("Failed to upload avatar to storage");
            }

            user.AvatarUrl = avatarUrl;
            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                throw new Exception("Update user fail");
            }

            UploadAvatarResponse response = new UploadAvatarResponse { AvatarUrl = avatarUrl };

            return Result<UploadAvatarResponse>.Success(response);
        }

        public async Task<Result<string>> DeleteAvatar(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            if (user.AvatarUrl == null)
            {
                return Result<string>.Failure(new List<string> { "Avatar already removed" });
            }

            user.AvatarUrl = null;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded) return Result<string>.Failure(new List<string> { "Update user failed." });

            return Result<string>.Success();
        }

        // ACTIVE/DEACTIVE USER
        public async Task<Result<string>> ChangeUserStatus(UpdateUserStatusCommand command, Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            if (user.Status == command.UserStatus)
            {
                return Result<string>.Failure(new List<string> { "User status has been updated" });
            }

            user.Status = command.UserStatus;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return Result<string>.Failure(new List<string> { "Update user failed." });

            return Result<string>.Success();
        }

    }
}
