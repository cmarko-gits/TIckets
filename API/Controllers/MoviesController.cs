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
        public async Task<ActionResult<List<MovieDto>>> GetMovies()
        {
            var movies = await _movieService.GetMoviesAsync();
            
            if (movies == null || movies.Count == 0)
            {
                return NotFound("No movies found");
            }

            return Ok(movies);
        }
    }
}
