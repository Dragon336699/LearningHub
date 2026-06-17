namespace LearningHub.Application.Services;

using LearningHub.Application.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class DashboardSummaryWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public DashboardSummaryWorker(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            DateTime now = DateTime.Now;
            DateTime nextRun = now.Date.AddDays(1).AddHours(2);

            var delay = nextRun - now;

            await Task.Delay(delay, stoppingToken);

            using (var scope = _serviceProvider.CreateScope())
            {
                var dashboardService = scope.ServiceProvider.GetRequiredService<IDashboardSummaryService>();
                try
                {
                    await dashboardService.SaveOrUpdateDashboardSummaryAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }
    }
}
