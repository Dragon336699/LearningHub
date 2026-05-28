using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Interfaces;

public interface IOtpService
{
    Task SendOtpAsync(string to, string subject, string body);
}