using AutoMapper;
using LearningHub.API.Contracts.Users;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;
using Microsoft.AspNetCore.Identity;

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

        public async Task CreateUserProfile(CreateUserProfileCommand command)
        {
            var user = await _userManager.FindByIdAsync(command.UserId.ToString());

            if (user == null)
            {
                throw new KeyNotFoundException("User can't be found");
            }

            if (await _userManager.IsInRoleAsync(user, "Mentor"))
            {
                user.CoachCost = command.CoachCost ?? 0;
            }

            user.Description = command.Description;
            user.Skills = command.Skills;
            //user.Experiences = _mapper.Map<List<Experience>>(command.Experiences);
            //user.Expertises = _mapper.Map<List<Expertise>>(command.Exterpises);

            var result = await _userManager.UpdateAsync(user);
            //if (command.Experiences != null)
            //{
            //    await _unitOfWork.Experiences.AddRangeAsync();
            //}
        }
    }
}
