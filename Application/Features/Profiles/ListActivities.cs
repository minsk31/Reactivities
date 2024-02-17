using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.ViewModel;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Activities
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<ViewModel.UserActivityDTO>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ViewModel.UserActivityDTO>>>
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

            public async Task<Result<List<ViewModel.UserActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                .OrderBy(activity => activity.Date)
                .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUserName() })
                .Where(x => x.HostUserName == request.UserName || x.Attendees.Any(a => a.UserName == request.UserName))
                .ProjectTo<ViewModel.UserActivityDTO>(_mapper.ConfigurationProvider)
                .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        query = query.Where(x => x.Date <= DateTime.UtcNow);
                        break;

                    case "future":
                        query = query.Where(x => x.Date > DateTime.UtcNow);
                        break;

                    case "hosting":
                        query = query.Where(x => x.HostUserName == request.UserName);
                        break;

                    default:
                        query = query.Where(x => x.Date > DateTime.UtcNow);
                        break;
                }

                return Result<List<ViewModel.UserActivityDTO>>.Success(await query.ToListAsync(cancellationToken));
            }
        }
    }
}