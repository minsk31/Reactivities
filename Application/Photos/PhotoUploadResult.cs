namespace Application.Photos
{
    public class PhotoCreateResult
    {
        public bool isSuccess { get; set; }
        public PhotoInfra Value { get; set; }

        public string Error { get; set; }
        public static PhotoCreateResult Success(PhotoInfra value) => new PhotoCreateResult { isSuccess = true, Value = value };

        public static PhotoCreateResult Failure(string message) => new PhotoCreateResult { isSuccess = false, Error = message };

        public class PhotoInfra
        {
            public byte[] Bytes { get; set; }
            public string Description { get; set; }
            public string FileExtension { get; set; }
            public decimal Size { get; set; }
        }

    }
}