using Hangfire;
using LearningHub.API.Common.Middlewares;
using LearningHub.API.Configs;
using LearningHub.Application.Interfaces.Seeder;
using LearningHub.Application.Interfaces.Services;
using LearningHub.Domain.Constants;
using LearningHub.Infrastructure.BackgroundJobs;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

//Host url from appsetting

builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.Configure(context.Configuration.GetSection("Kestrel"));
});
// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.ConfigureAuth(builder.Configuration);
builder.Services.AddInfrastructure();
builder.Services.AddDbContext<LearningHubDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

builder.Services.AddAuthorization(options => {
    options.AddPolicy(RoleName.Mentor, policy => policy.RequireRole(RoleName.Mentor));
    options.AddPolicy(RoleName.Trainee, policy => policy.RequireRole(RoleName.Trainee));
    options.AddPolicy(RoleName.Admin, policy => policy.RequireRole(RoleName.Admin));

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.MapGet("/", context =>
    {
        context.Response.Redirect("/swagger");
        return Task.CompletedTask;
    });
    app.UseHangfireDashboard("/hangfire");
}

var jobOptions = builder.Configuration
    .GetSection(BackgroundJobsOptions.SectionName)
    .Get<BackgroundJobsOptions>() ?? new BackgroundJobsOptions();

//Hangfire
RecurringJob.AddOrUpdate<DashboardSummaryJob>(
    jobOptions.Dashboard.JobName,
    service => service.RunDailySnapshotAsync(),
    jobOptions.Dashboard.Schedule,
    new RecurringJobOptions 
    { 
        TimeZone = jobOptions.TimeZoneInfo 
    }
);

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>();

if (allowedOrigins == null || allowedOrigins.Length == 0)
{
    throw new InvalidOperationException("Cors:AllowedOrigins is missing or empty in configuration");
}

app.UseCors(options => options
    .WithOrigins(allowedOrigins!)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
);

using (var scope = app.Services.CreateScope())
{
    var seeders = scope.ServiceProvider.GetServices<IDataSeeder>();

    foreach (var seeder in seeders)
    {
        await seeder.SeedAsync();
    }
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
