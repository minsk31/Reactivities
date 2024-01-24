namespace API.Helpers
{
    public class ImageHelper
    {
        public static string GetSourceFromBytes(byte[] bytes)
        {
            if(bytes == null) return null;
            
            return "data:image/jpeg;base64," + Convert.ToBase64String(bytes);
        }
    }
}