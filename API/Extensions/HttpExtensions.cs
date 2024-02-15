using System.Text.Json;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse httpResponse, int currentPage,
    int itemsPerPage, int totalItems, int totalPages)
    {
        var paginationHeader = new{
            currentPage,
            itemsPerPage, 
            totalItems,
            totalPages
        };

        httpResponse.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
        httpResponse.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}