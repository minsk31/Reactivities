using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirment: IAuthorizationRequirement
    {        
    }

    public class IsHostRequirmentHandler : AuthorizationHandler<IsHostRequirment>
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirmentHandler(DataContext dataContext, IHttpContextAccessor httpContextAccessor)
        {
            _dataContext = dataContext;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirment requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId == null) return Task.CompletedTask;

            var activity = _httpContextAccessor.HttpContext?
                .Request?.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString();

            var activityId = Guid.Parse(activity);

            var attendee = _dataContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId).Result;

            if(attendee == null) return Task.CompletedTask;

            if(attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}