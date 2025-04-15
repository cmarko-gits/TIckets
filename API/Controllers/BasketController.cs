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
                PosterUrl = movieDto.Poster, 
                Quantity = 1
            };

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

        [HttpPost("removeOne")]
        public async Task<ActionResult> RemoveOne(int movieId)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(username))
                return Unauthorized("Korisnik nije ulogovan");

            var item = await _context.BasketItems
                .FirstOrDefaultAsync(i => i.UserName == username && i.MovieId == movieId);

            if (item == null)
                return NotFound("Stavka nije pronađena u korpi");

            if (item.Quantity > 1)
            {
                item.Quantity--;
            }
            else
            {
                _context.BasketItems.Remove(item);
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Došlo je do greške prilikom uklanjanja stavke");
        }

        [Authorize]
        [HttpDelete("{movieId}")]  
        public async Task<ActionResult> RemoveItem(int movieId)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var item = await _context.BasketItems
                .FirstOrDefaultAsync(b => b.UserName == username && b.MovieId == movieId);  // Koristi movieId

            if (item == null) 
            {
                return NotFound();
            }

            _context.BasketItems.Remove(item);
            var result = await _context.SaveChangesAsync() > 0;

            if (result) 
            {
                return Ok();
            }

            return BadRequest("Problem prilikom brisanja stavke iz korpe");
        }


    }

    
}