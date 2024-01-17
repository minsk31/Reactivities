using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        public async Task<PhotoCreateResult> CreatePhoto(IFormFile formFile)
        {
            if (formFile.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await formFile.CopyToAsync(memoryStream);
                    // Upload the file if less than 2 MB  
                    if (memoryStream.Length < 2097152)
                    {
                        //based on the upload file to create Photo instance.  
                        //You can also check the database, whether the image exists in the database.  

                        return PhotoCreateResult.Success(new PhotoCreateResult.PhotoInfra
                        {
                            Bytes = memoryStream.ToArray(),
                            Description = formFile.FileName,
                            FileExtension = Path.GetExtension(formFile.FileName),
                            Size = formFile.Length,
                        });
                    }
                    else
                    {
                        return PhotoCreateResult.Failure("File is too large.");
                    }
                }
            }

            return PhotoCreateResult.Failure("File is empty or not valid");
        }

        public Task<string> DeletePhoto(string id)
        {
            throw new NotImplementedException();
        }
    }
}