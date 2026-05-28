using LearningHub.Application.Common;
using LearningHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningHub.Application.Interfaces.Services;

public interface IRoleService
{
    Task<Result<List<Role>>> GetRolesAsync();
}
