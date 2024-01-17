using Application.Core;
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

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<ViewModel.Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var result = await _context.Users
                .ProjectTo<ViewModel.Profile>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.UserName == request.UserName);            

                return Result<ViewModel.Profile>.Success(result); 
            }
        }
    }
}