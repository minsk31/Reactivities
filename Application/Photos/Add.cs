using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.ViewModel;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<PhotoDTO>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<PhotoDTO>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _mapper = mapper;
            }

            public async Task<Result<PhotoDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos)
                  .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                var result = await _photoAccessor.CreatePhoto(request.File);

                if (!result.isSuccess)
                {
                    return Result<PhotoDTO>.Failure($"Failed to create a photo: {result.Error}");
                }

                var photo = new Photo();
                _mapper.Map(result.Value, photo);

                if (!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);

                var saveResult = await _context.SaveChangesAsync() > 0;

                if (!saveResult)
                {
                    return Result<PhotoDTO>.Failure("Failed to add photo");
                }

                var photoDTO = new PhotoDTO();
                _mapper.Map(photo, photoDTO);
                return Result<PhotoDTO>.Success(photoDTO);
            }
        }
    }
}