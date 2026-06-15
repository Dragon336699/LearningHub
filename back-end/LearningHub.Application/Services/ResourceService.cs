using AutoMapper;
using LearningHub.Application.Common.Constants;
using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.Resources;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Domain.Entities;

namespace LearningHub.Application.Services
{
    public class ResourceService : IResourceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorageService;
        private readonly ICurrentSessionService _currentSessionService;
        public ResourceService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService, IMapper mapper, ICurrentSessionService currentSessionService)
        {
            _unitOfWork = unitOfWork;
            _fileStorageService = fileStorageService;
            _mapper = mapper;
            _currentSessionService = currentSessionService;
        }

        public async Task<Result<ResourceDto>> CreateResourceAsync(CreateResourceCommand command)
        {
            string? resourceUrl = null;

            resourceUrl = await _fileStorageService.UploadFileAsync(command.ResourceFile, "Resource");
            if (resourceUrl == null)
            {
                throw new IOException(Messages.UploadFile.UploadFailed);
            }

            Resource resource = new Resource
            {
                Title = command.Title.Trim(),
                Description = command.Description.Trim(),
                Url = resourceUrl,
                CourseId = command.CourseId
            };

            await _unitOfWork.Resources.AddAsync(resource);
            await _unitOfWork.CompleteAsync();

            return Result<ResourceDto>.Success(_mapper.Map<ResourceDto>(resource));
        }

        public async Task<Result<PagedResult<ResourceDto>>> GetResourcesAsync(int page = 1, int pageSize = 10, string? keyword = "")
        {
            Guid traineeId = _currentSessionService.UserId;
            keyword = keyword.Trim().ToLower() ?? "";
            PagedResult<Resource> resources = await _unitOfWork.Resources.GetPagedResourcesByTrainee(page, pageSize, keyword, traineeId);

            List<ResourceDto> resourceList = _mapper.Map<List<ResourceDto>>(resources.Items);
            PagedResult<ResourceDto> pagedResult = new PagedResult<ResourceDto>
            {
                Items = resourceList,
                Page = page,
                PageSize = pageSize,
                TotalCount = resources.TotalCount
            };

            return Result<PagedResult<ResourceDto>>.Success(pagedResult);
        }

        public async Task<Result<PagedResult<ResourceDto>>> GetResourcesByMentor(int page = 1, int pageSize = 10, string? keyword = "")
        {
            Guid userId = _currentSessionService.UserId;
            keyword = keyword.Trim().ToLower() ?? "";
            PagedResult<Resource> resources = await _unitOfWork.Resources.GetPagedResourcesByMentor(page, pageSize, keyword, userId);

            List<ResourceDto> resourceList = _mapper.Map<List<ResourceDto>>(resources.Items);
            PagedResult<ResourceDto> pagedResult = new PagedResult<ResourceDto>
            {
                Items = resourceList,
                Page = page,
                PageSize = pageSize,
                TotalCount = resources.TotalCount
            };

            return Result<PagedResult<ResourceDto>>.Success(pagedResult);
        }

        public async Task<Result<ResourceDto>> UpdateResourceAsync(UpdateResourceCommand command)
        {
            Resource? existResource = await _unitOfWork.Resources.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException(Messages.ResourceMessage.ResourceNotFound);

            existResource.Title = command.Title.Trim();
            existResource.Description = command.Description.Trim();
            existResource.CourseId = command.CourseId;
            existResource.UpdatedAt = DateTimeOffset.UtcNow;

            string? resourceUrl = null;
            if (command.ResourceFile != null)
            {
                resourceUrl = await _fileStorageService.UploadFileAsync(command.ResourceFile, "Resource");
                if (resourceUrl == null)
                {
                    throw new IOException(Messages.UploadFile.UploadFailed);
                }
                existResource.Url = resourceUrl;
            }
            await _unitOfWork.CompleteAsync();

            return Result<ResourceDto>.Success(_mapper.Map<ResourceDto>(existResource));
        }

        public async Task DeleteResourceAsync(Guid resourceId)
        {
            Guid mentorId = _currentSessionService.UserId;

            Resource existResource = await _unitOfWork.Resources.GetWithConditionAndIncludeAsync(r => r.Id == resourceId, r => r.Course) ?? throw new KeyNotFoundException(Messages.ResourceMessage.ResourceNotFound);

            if (mentorId != existResource.Course.UserId)
            {
                throw new UnauthorizedAccessException(Messages.Auth.ActionForbidden);
            }

            _unitOfWork.Resources.Remove(existResource);
            await _unitOfWork.CompleteAsync();
        }
    }
}
