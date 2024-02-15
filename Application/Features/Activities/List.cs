using Application.Core;
using Application.Features.Activities;
using Application.Interfaces;
using Application.ViewModel;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDTO>>>
        {
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<PagedList<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                .Where(x => x.Date > request.Params.StartDate)
                .OrderBy(activity => activity.Date)
                .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUserName() })
                .AsQueryable();

                if(request.Params.IsGoing && !request.Params.IsHost){
                    query = query.Where(x => x.HostUserName != userAccessor.GetUserName() && x.Attendees.Any(a => a.UserName == userAccessor.GetUserName()));
                }

                if(!request.Params.IsGoing && request.Params.IsHost){
                    query = query.Where(x => x.HostUserName == userAccessor.GetUserName());
                }

                return Result<PagedList<ActivityDTO>>.Success(
                    await PagedList<ActivityDTO>.CreateAsync(query,
                     request.Params.PageNumber,
                     request.Params.PageSize)
                );
            }
        }
    }
}