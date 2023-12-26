namespace Application.Core
{
    public class Result<T>
    {
        public bool isSuccess { get; set; }

        public T Value { get; set; }

        public string Error { get; set; }

        public static Result<T> Success(T value) => new Result<T> { isSuccess = true, Value = value };

        public static Result<T> Failure(string message) => new Result<T> { isSuccess = false, Error = message };

    }
}