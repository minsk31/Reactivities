using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos)
                  .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var toUpdate = await _context.Photos.FirstOrDefaultAsync(x => x.Id == request.Id);

                if (toUpdate == null) return null;

                if (toUpdate.IsMain) return Result<Unit>.Success(Unit.Value);

                var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
                if (currentMain != null)
                {
                    currentMain.IsMain = false;
                }

                toUpdate.IsMain = true;

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update main photo");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}