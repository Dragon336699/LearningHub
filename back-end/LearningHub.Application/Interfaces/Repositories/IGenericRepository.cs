using System.Linq.Expressions;

namespace LearningHub.Application.Interfaces.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        T? GetById(int id);
        IEnumerable<T> GetAll();
        IEnumerable<T> Find(Expression<Func<T, bool>> expression);
        void Add(T entity);
        void AddRange(IEnumerable<T> entities);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
        Task<T?> GetByIdAsync(object id);
        Task<T?> GetWithConditionAndIncludeAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetByIdsAsync(IEnumerable<Guid> ids);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> expression);
    }
}
