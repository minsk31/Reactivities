using Application.Core;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ViewModel.Profile Profile { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Profile.DisplayName).NotEmpty();
            }
        }

         public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                //_mapper.Map(request.Profile, user);

                user.DisplayName = request.Profile.DisplayName;
                user.Bio = request.Profile.Bio ?? user.Bio;

                _context.Entry(user).State = EntityState.Modified;
                
                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update profile");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}