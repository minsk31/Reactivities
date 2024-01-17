using Microsoft.AspNetCore.Http;

namespace Application.Photos
{
    public interface IPhotoAccessor
    {
        Task<PhotoCreateResult> CreatePhoto(IFormFile formFile);

        Task<string> DeletePhoto(string id);
    }
}