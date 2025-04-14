using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly MovieService _movieService;

        public MovieController(MovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<ActionResult<List<MovieDto>>> GetMovies(
            [FromQuery] string searchTerm,
            [FromQuery] string genres,
            [FromQuery] string actors,
            [FromQuery] string director,
            [FromQuery] int? minDuration,
            [FromQuery] int? maxDuration,
            [FromQuery] string startDate,
            [FromQuery] string endDate,
            [FromQuery] string orderBy)
        {
            // Poziv servisa za pretragu i filtriranje filmova
            var movies = await _movieService.GetFilteredSortedSearchedMovies(
                searchTerm, genres, actors, director, minDuration, 
                maxDuration, startDate, endDate, orderBy);

            // Ako nisu pronađeni filmovi, vrati 404 Not Found
            if (movies == null || movies.Count == 0)
            {
                return NotFound("No movies found matching your search criteria.");
            }

            return Ok(movies);
        }

        // GET api/movie/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDto>> GetMovieById(int id)
        {
            // Poziv servisa za dobijanje filma po ID-u
            var movie = await _movieService.GetMovieByIdAsync(id);

            // Ako film nije pronađen, vraćamo 404 Not Found
            if (movie == null)
            {
                return NotFound($"Film sa ID-jem {id} nije pronađen.");
            }

            return Ok(movie);
        }

        
    }
}
