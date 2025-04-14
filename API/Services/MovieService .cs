using API.DTOs;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

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

        public async Task<List<MovieDto>> GetFilteredSortedSearchedMovies(
            string searchTerm, 
            string genres, 
            string actors, 
            string director, 
            int? minDuration, 
            int? maxDuration, 
            string startDate, 
            string endDate, 
            string orderBy)
        {
            var movies = await GetMoviesAsync();

            // Pretraga po terminu
            if (!string.IsNullOrEmpty(searchTerm))
            {
                movies = movies.Where(m =>
                    m.Title.ToLower().Contains(searchTerm.ToLower()) ||
                    m.Description.ToLower().Contains(searchTerm.ToLower()) ||
                    m.ShortDescription.ToLower().Contains(searchTerm.ToLower())
                ).ToList();
            }

           if (!string.IsNullOrEmpty(genres))
{
            var genreTerms = genres.ToLower().Split(",").Select(g => g.Trim()).ToList();
            movies = movies.Where(m =>
                m.MovieGenres.Any(g =>
                    genreTerms.Any(term => g.Genre.Name.ToLower().Contains(term))
                )
            ).ToList();
        }

            // Filtriranje po glumcima
            if (!string.IsNullOrEmpty(actors))
            {
                var actorList = actors.ToLower().Split(",").ToList();
                movies = movies.Where(m =>
                    m.MovieActors.Any(a => actorList.Contains(a.Actor.Name.ToLower()))
                ).ToList();
            }

            // Filtriranje po reditelju
            if (!string.IsNullOrEmpty(director))
            {
                movies = movies.Where(m =>
                    m.Director.Name.ToLower().Contains(director.ToLower())
                ).ToList();
            }

            // Filtriranje po minimalnom trajanju
            if (minDuration.HasValue)
            {
                movies = movies.Where(m => m.RunTime >= minDuration.Value).ToList();
            }

            // Filtriranje po maksimalnom trajanju
            if (maxDuration.HasValue)
            {
                movies = movies.Where(m => m.RunTime <= maxDuration.Value).ToList();
            }

            // Filtriranje po datumu početka
            if (!string.IsNullOrEmpty(startDate))
            {
                var startDateParsed = DateTime.Parse(startDate);
                movies = movies.Where(m => DateTime.Parse(m.StartDate) >= startDateParsed).ToList();
            }

            // Filtriranje po datumu kraja
            if (!string.IsNullOrEmpty(endDate))
            {
                var endDateParsed = DateTime.Parse(endDate);
                movies = movies.Where(m => DateTime.Parse(m.StartDate) <= endDateParsed).ToList();
            }

            // Sortiranje
            if (!string.IsNullOrEmpty(orderBy))
            {
                switch (orderBy)
                {
                    case "  ":
                        movies = movies.OrderBy(m => m.RunTime).ToList();
                        break;
                    case "durationDesc":
                        movies = movies.OrderByDescending(m => m.RunTime).ToList();
                        break;
                    case "title":
                        movies = movies.OrderBy(m => m.Title).ToList();
                        break;
                    case "titleDesc":
                        movies = movies.OrderByDescending(m => m.Title).ToList();
                        break;
                    default:
                        movies = movies.OrderBy(m => m.Title).ToList();
                        break;
                }
            }

            return movies;
        }

        // Dodajemo GetGenresAsync metodu
        public async Task<List<string>> GetGenresAsync()
        {
            var response = await _httpClient.GetAsync("https://movie.pequla.com/api/genres");
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Greška u API pozivu: {response.StatusCode}");
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            var genres = JsonConvert.DeserializeObject<List<string>>(jsonString);
            return genres;
        }


        public async Task<MovieDto> GetMovieByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"https://movie.pequla.com/api/movie/{id}");
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Greška u API pozivu: {response.StatusCode}");
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            var movie = JsonConvert.DeserializeObject<MovieDto>(jsonString);
            return movie;
        }
    }
}