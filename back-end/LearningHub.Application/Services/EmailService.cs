// LearningHub.Infrastructure.Services
using System.Net.Http.Headers;
using System.Net.Http.Json;
using LearningHub.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace LearningHub.Application.Services;

public class EmailService : INotificationService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _fromEmail;

    public EmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["ResendSettings:ApiKey"] ?? throw new ArgumentNullException("Missing Api Key");
        _fromEmail = configuration["ResendSettings:FromEmail"] ?? throw new ArgumentNullException("Missing Source Email");
    }

    public async Task SendMessageAsync(string to, string subject, string body)
    {
        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");

        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var payload = new
        {
            from = _fromEmail,
            to = new[] { to }, 
            subject = subject,
            html = body
        };

        requestMessage.Content = JsonContent.Create(payload);

        var response = await _httpClient.SendAsync(requestMessage);

        if (!response.IsSuccessStatusCode)
        {
            var errorResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"[RESEND ERROR]: Can not send email. Details: {errorResponse}");
        }
    }
}