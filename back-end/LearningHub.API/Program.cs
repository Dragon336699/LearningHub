using LearningHub.API.Common.Middlewares;
using LearningHub.API.Configs;
using LearningHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using LearningHub.Application.Interfaces.Seeder;

var builder = WebApplication.CreateBuilder(args);

//Host url from appsetting

builder.WebHost.ConfigureKestrel((context, options) =>
{
    options.Configure(context.Configuration.GetSection("Kestrel"));
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureAuth(builder.Configuration);
builder.Services.AddInfrastructure();
builder.Services.AddDbContext<LearningHubDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

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
}

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
