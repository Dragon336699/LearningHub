using LearningHub.Application.Interfaces.Services;
using Microsoft.Extensions.Caching.Memory;

namespace LearningHub.Application.Services
{
    public class MemoryCacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;

        public MemoryCacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public Task SetAsync<T>(string key, T value, TimeSpan expiration)
        {
            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            };

            _memoryCache.Set(key, value, cacheOptions);

            return Task.CompletedTask;
        }

        public Task<T?> GetAsync<T>(string key)
        {
            if (_memoryCache.TryGetValue(key, out T? value))
            {
                return Task.FromResult(value);
            }

            return Task.FromResult(default(T?));
        }

        public Task RemoveAsync(string key)
        {
            _memoryCache.Remove(key);

            return Task.CompletedTask;
        }
    }
}