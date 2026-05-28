using AutoMapper;
using LearningHub.Application.Common;
using LearningHub.Application.Dtos.Expertises;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;

namespace LearningHub.Application.Services
{
    public class ExpertiseService : IExpertiseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ExpertiseService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<ExpertiseDto>>> GetAllExpertisesAsync()
        {
            var expertiese = await _unitOfWork.Expertises.GetAllAsync();
            return Result<List<ExpertiseDto>>.Success(_mapper.Map<List<ExpertiseDto>>(expertiese));
        }
    }
}
