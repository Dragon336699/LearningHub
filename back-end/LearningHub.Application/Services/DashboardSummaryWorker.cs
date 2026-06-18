namespace LearningHub.Application.Services;

using LearningHub.Application.Common.Constants;
using LearningHub.Application.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class DashboardSummaryWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly string _emailAddress = "thanhthanhbg1@gmail.com";

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
                var emailService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                try
                {
                    await dashboardService.SaveOrUpdateDashboardSummaryAsync();

                    await emailService.SendMessageAsync(
                        _emailAddress,
                        "Job Success: Dashboard Summary",
                        Messages.Email.WorkerSuccess());
                }
                catch (Exception ex)
                {
                    await emailService.SendMessageAsync(
                        _emailAddress,
                        "Job Failed: Dashboard Summary",
                       Messages.Email.WorkerFailed(ex.Message, ex.StackTrace));
                }
            }
        }
    }
}
