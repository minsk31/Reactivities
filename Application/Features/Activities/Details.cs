using Application.Core;
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
    public class Details
    {
        public class Query : IRequest<Result<ActivityDTO>>
        {
            public Guid Id { get; set; }
            public Query(Guid id)
            {
                Id = id;
            }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDTO>>
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

            public async Task<Result<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var result = await _context.Activities
                .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUserName() })
                .FirstOrDefaultAsync(x => x.Id == request.Id);
                

                return Result<ActivityDTO>.Success(result); 
            }
        }
    }
}