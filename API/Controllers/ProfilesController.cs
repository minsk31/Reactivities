using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.Profiles;
using Application.Profiles;
using Application.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query(userName)));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(Profile profile )
        {
            return HandleResult(await Mediator.Send(new Edit.Command{Profile = profile}));
        }
    }
}