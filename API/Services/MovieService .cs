using API.DTOs;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace API.Services
{
    public class MovieService
    {
        private readonly HttpClient _httpClient;

        public MovieService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<MovieDto>> GetMoviesAsync()
        {
            var response = await _httpClient.GetAsync("https://movie.pequla.com/api/movie");
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Greška u API pozivu: {response.StatusCode}");
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<MovieDto>>(jsonString);
        }

        public async Task<MovieDto> GetMovieByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"https://movie.pequla.com/api/movie/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<MovieDto>(jsonString);
        }

    }
}
