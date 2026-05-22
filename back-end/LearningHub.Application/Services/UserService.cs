using AutoMapper;
using LearningHub.Application.Dtos.Users;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork unitOfWork, UserManager<User> userManager, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
        }

        //Create user profile
        public async Task CreateUserProfile(CreateUserProfileCommand command, Guid userId)
        {
            var user = await _userManager.Users
                .Include(x => x.Experiences)
                .Include(x => x.Expertises)
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            if (await _userManager.IsInRoleAsync(user, "Mentor"))
            {
                user.CoachCost = command.CoachCost ?? 0;
            }

            user.Bio = command.Bio;
            user.Skills = command.Skills;

            var experiences = command.Experiences.Select(x => new Experience
            {
                Title = x.Title,
                Description = x.Description,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                UserId = userId
            }).ToList();

            await _unitOfWork.Experiences.AddRangeAsync(experiences);

            var userExpertise = _mapper.Map<List<Expertise>>(command.Expertises);
            user.Expertises = userExpertise;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new Exception("Create user profile failed");
            }

            await _unitOfWork.CompleteAsync();
        }

        //Read user profile
           
        public async Task<UserDto> GetUserProfile(Guid userId)
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

            return _mapper.Map<UserDto>(user);
        }

        //Update user profile
        public async Task UpdateUserProfile(UpdateUserProfileCommand command, Guid userId)
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
                    existExp.StartDate = expDto.StartDate;
                    existExp.EndDate = expDto.EndDate;
                }
                else
                {
                    await _unitOfWork.Experiences.AddAsync(new Experience
                    {
                        Title = expDto.Title,
                        Description = expDto.Description,
                        StartDate = expDto.StartDate,
                        EndDate = expDto.EndDate,
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
            var requestExpertiseIds = command.Expertises.Select(x => x.Id);
            var expertises = await _unitOfWork.Expertises.GetByIdsAsync(requestExpertiseIds);

            user.Expertises.Clear();
            user.Expertises = expertises;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new Exception("Create user profile failed");
            }

        }
    }
}
