using Application.Activities;
using Application.Features.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetActivities()
        {
            var result = await Mediator.Send(new List.Query());
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            var result = await Mediator.Send(new Details.Query(id));

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<ActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command() { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<ActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command() { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command() { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command() { Id = id }));
        }
    }
}