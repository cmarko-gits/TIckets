using System.Security.Claims;
using API.Data;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Samo ulogovani korisnici mogu pristupiti
    public class BasketController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DataContext _context;
        private readonly MovieService _movieService;

        public BasketController(UserManager<User> userManager, DataContext context, MovieService movieService)
        {
            _userManager = userManager;
            _context = context;
            _movieService = movieService;
        }

        // GET: api/Basket
        [HttpGet]
        public async Task<ActionResult<List<BasketItem>>> GetBaskets()
        {
            // Preuzimamo korisničko ime iz tokena
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(username))
                return Unauthorized("Korisnik nije ulogovan");

            var items = await _context.BasketItems
                .Where(item => item.UserName == username)
                .ToListAsync();

            return Ok(items);
        }

        // POST: api/Basket/add/{movieId}
        [HttpPost]
        public async Task<ActionResult<BasketItem>> AddMovieToBasket(int movieId)
        {
            // Preuzimamo korisničko ime iz tokena
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(username))
                return Unauthorized("Korisnik nije ulogovan");

            // Dobijanje detalja filma preko MovieService
            var movieDto = await _movieService.GetMovieByIdAsync(movieId);
            if (movieDto == null)
                return NotFound($"Film sa ID-jem {movieId} nije pronađen");

            // Kreiraj novu stavku u basket-u
            var basketItem = new BasketItem
            {
                UserName = username,
                MovieId = movieDto.MovieId,
                Title = movieDto.Title,
                PosterUrl = movieDto.Poster, // prilagodi prema poljima u MovieDto modelu
                Quantity = 1
            };

            // Opcionalno: Ako već postoji stavka sa istim MovieId, možete povećati quantity
            var existingItem = await _context.BasketItems
                .FirstOrDefaultAsync(item => item.UserName == username && item.MovieId == movieDto.MovieId);

            if (existingItem != null)
            {
                existingItem.Quantity += 1;
                await _context.SaveChangesAsync();
                return Ok(existingItem);
            }
      
                _context.BasketItems.Add(basketItem);
                await _context.SaveChangesAsync();
                return Ok(basketItem);
            
        }



    }

    
}