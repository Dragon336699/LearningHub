using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Interfaces.Services;

public interface INotificationService
{
    Task SendMessageAsync(string to, string subject, string body);
}