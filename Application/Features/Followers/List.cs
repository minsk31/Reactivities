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

namespace Application.Features.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<ViewModel.Profile>>>
        {
            public string Predicate { get; set; }

            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ViewModel.Profile>>>
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

            public async Task<Result<List<ViewModel.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<ViewModel.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings
                            .Where(x => x.Target.UserName == request.UserName)
                            .Select(u => u.Observer)
                            .ProjectTo<ViewModel.Profile>(_mapper.ConfigurationProvider,
                                    new { currentUsername = userAccessor.GetUserName() })
                            .ToListAsync(cancellationToken);
                        break;
                    case "following":
                        profiles = await _context.UserFollowings
                            .Where(x => x.Observer.UserName == request.UserName)
                            .Select(u => u.Target)
                            .ProjectTo<ViewModel.Profile>(_mapper.ConfigurationProvider,
                            new { currentUsername = userAccessor.GetUserName() }                           )
                            .ToListAsync(cancellationToken);
                        break;

                    default:
                        break;
                }

                return Result<List<ViewModel.Profile>>.Success(profiles);
            }
        }
    }
}