using System.Linq.Expressions;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> Find(Expression<Func<T, bool>> expression);
        Task<List<T>> FindAllAsync(Expression<Func<T, bool>> expression);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
        Task<T?> GetByIdAsync(Guid id);
        Task<T?> GetWithConditionAndIncludeAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetByIdsAsync(IEnumerable<Guid> ids);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> expression);
    }
}
