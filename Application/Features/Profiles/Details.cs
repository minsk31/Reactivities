using Application.Core;
using Application.Interfaces;
using Application.ViewModel;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<ViewModel.Profile>>
        {
            public string UserName { get; set; }
            public Query(string userName)
            {
                UserName = userName;
            }
        }

        public class Handler : IRequestHandler<Query, Result<ViewModel.Profile>>
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

            public async Task<Result<ViewModel.Profile>> Handle(Query request,
             CancellationToken cancellationToken)
            {
                var result = await _context.Users
                .ProjectTo<ViewModel.Profile>(_mapper.ConfigurationProvider,
                     new { currentUsername = userAccessor.GetUserName() })
                .FirstOrDefaultAsync(x => x.UserName == request.UserName);

                return Result<ViewModel.Profile>.Success(result);
            }
        }
    }
}