using LearningHub.Application.Common.Constants;
using LearningHub.Application.Common.Results;
using LearningHub.Application.Dtos.DashboardSummaries;
using LearningHub.Application.Interfaces.Repositories;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Application.Interfaces.UnitOfWork;
using LearningHub.Application.Mappers;
using LearningHub.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;

namespace LearningHub.Application.Services
{
    public class DashboardSummaryService: IDashboardSummaryService
    {
        private readonly IConfiguration _configuration;
        private readonly IDashboardSummaryRepository _dashboardSummaryRepository;
        private readonly IUserRepository _userRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IBookingSessionRepository _bookingSessionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private readonly HttpClient _httpClient;
        private readonly string _zenQuoteAPI;
        private readonly string _quoteKey = "ZenQuote";

        public DashboardSummaryService(IDashboardSummaryRepository dashboardSummaryRepository,
            IUserRepository userRepository,
            IResourceRepository resourceRepository,
            IBookingSessionRepository bookingSessionRepository,
            IUnitOfWork unitOfWork,
            IConfiguration configuration,
            ICacheService cacheService,
            HttpClient httpClient)
        {
            _dashboardSummaryRepository = dashboardSummaryRepository;
            _userRepository = userRepository;
            _resourceRepository = resourceRepository;
            _bookingSessionRepository = bookingSessionRepository;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _cacheService = cacheService;
            _zenQuoteAPI = _configuration["ZenQuotesAPI"];
            _httpClient = httpClient;
        }

        //Hybrid Strategy: A background job runs overnight to calculate the cumulative total and saves it to a compact vertical table, releasing fb workload.
        //When the administrator views today's data, the service automatically extracts static past data and combines it with real-time current data.
        //The result is combined into a unified array, allowing the frontend to create smooth and highly accurate charts.
        public async Task SaveOrUpdateDashboardSummaryAsync()
        {
            DateTime today = DateTime.Today;                     // Eg: 12/06/2026 00:00:00
            DateTime targetDate = today.AddDays(-1);             // 11/06/2026 00:00:00
            DateTime endOfTargetDate = today.AddTicks(-1);       // 11/06/2026 23:59:59.99

            var (totalActiveUsers, totalResources, totalSessions) = await GetCumulativeMetricsAsync(endOfTargetDate);

            DashboardSummary? existingSummary = await _dashboardSummaryRepository
                .FirstOrDefaultAsync(d => d.CreatedAt >= targetDate && d.CreatedAt < today);
            if (existingSummary == null)
            { 
                DashboardSummary newSummary = DashboardSummaryMappingProfile.ToEntity(
                    totalActiveUsers, 
                    totalResources, 
                    totalSessions,
                    endOfTargetDate);
                await _dashboardSummaryRepository.AddAsync(newSummary);
            }
            else
            {
                DashboardSummaryMappingProfile.ToEntityUpdate(
                    existingSummary, 
                    totalActiveUsers, 
                    totalResources, 
                    totalSessions);
                _dashboardSummaryRepository.Update(existingSummary);
            }

            await _unitOfWork.CompleteAsync();
        }

        // I thought about caching, but AC requires real-time accuracy
        public async Task<Result<IEnumerable<DashboardSummary>>> GetByTimeRangeAsync(GetDashboardSummaryRequest request)
        {
            DateTime startDate = request.FromDate.Date;
            DateTime endDate = request.ToDate.Date;
            DateTime today = DateTime.Now.Date;

            if (endDate < today)
            {
                DateTime nextDayOfEndDate = endDate.AddDays(1);
                
                IEnumerable<DashboardSummary> historicalSummaries = await _dashboardSummaryRepository
                    .GetSummariesInRangeAsync(startDate, nextDayOfEndDate);
                
                return Result<IEnumerable<DashboardSummary>>.Success(historicalSummaries);
            }
            else
            {
                List<DashboardSummary> summariesUntilYesterday = (await _dashboardSummaryRepository
                    .GetSummariesInRangeAsync(startDate, today)).ToList();

                DateTime endOfToday = today.AddDays(1).AddTicks(-1);
                var (totalActiveUsers, totalResources, totalSessions) = await GetCumulativeMetricsAsync(endOfToday);

                DashboardSummary todayLiveSummary = DashboardSummaryMappingProfile.ToEntity(
                    totalActiveUsers, 
                    totalResources, 
                    totalSessions,
                    today);

                summariesUntilYesterday.Add(todayLiveSummary);
                return Result<IEnumerable<DashboardSummary>>.Success(summariesUntilYesterday);
            }
        }

        public async Task<ZenQuote> GetDailyQuoteAsync()
        {
            ZenQuote? cachedQuote = await _cacheService.GetAsync<ZenQuote>(_quoteKey);
            if (cachedQuote != null) return cachedQuote;

            try
            {
                var response = await _httpClient.GetFromJsonAsync<List<ZenQuote>>(_zenQuoteAPI);
                var item = response?.FirstOrDefault();
                

                await _cacheService.SetAsync(_quoteKey, item, TimeSpan.FromHours(24));
                return item;
            }
            catch
            {
                return Messages.Dashboard.DefaultQuote();
            }
        }
        private async Task<(int TotalUsers, int TotalResources, int TotalSessions)> GetCumulativeMetricsAsync(DateTime endOfDate)
        {
            int totalActiveUsers = await _userRepository.Count();
            int totalResources = await _resourceRepository.CountByDate(endOfDate);
            int totalSessions = await _bookingSessionRepository.CountByDate(endOfDate);

            return (totalActiveUsers, totalResources, totalSessions);
        }

    }
}
