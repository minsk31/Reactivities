
using Infrastructure.Photos;

namespace API.Extensions
{
    public static class ConfigureSettingsExtensions
    {
        public static IServiceCollection AddConfiguration(this IServiceCollection services,
         IConfiguration configuration){

            services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));
            return services;
         }
    }
}