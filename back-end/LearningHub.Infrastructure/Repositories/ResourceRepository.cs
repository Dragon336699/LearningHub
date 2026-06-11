using LearningHub.Application.Common.Results;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Domain.Entities;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Infrastructure.Repositories
{
    public class ResourceRepository : GenericRepository<Resource>, IResourceRepository
    {
        public ResourceRepository(LearningHubDbContext context) : base(context)
        {

        }

        public async Task<PagedResult<Resource>> GetPagedResources(int page, int pageSize, string keyword)
        {
            IQueryable<Resource> query = _context.Set<Resource>();
            query = query.Where(r => r.Title.Contains(keyword));
            int totalCount = await query.CountAsync();
            var items = await query
                .Where(r => r.Title.Contains(keyword))
                .OrderByDescending(r => r.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(r => r.Course)
                .ToListAsync();

            return new PagedResult<Resource>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<PagedResult<Resource>> GetPagedResourcesByMentor(int page, int pageSize, string keyword, Guid userId)
        {
            IQueryable<Resource> query = _context.Set<Resource>();
            query = query.Where(r => r.Title.Contains(keyword) && r.Course.UserId == userId);
            int totalCount = await query.CountAsync();

            var items = await query
                .AsNoTracking()
                .Where(r => r.Title.Contains(keyword) && r.Course.UserId == userId)
                .Include(r => r.Course)
                .OrderByDescending(r => r.UpdatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Resource>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
    }
}
