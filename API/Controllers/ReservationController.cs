using System.Data;
using System.Runtime.CompilerServices;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
 [Authorize]
public class ReservationController : BaseController
{
    private readonly DataContext _context;

    public ReservationController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> ReserveFromBasket()
    {
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var basketItems = await _context.BasketItems
            .Where(u => u.UserName == username)
            .ToListAsync();

        if (basketItems.Count == 0) return BadRequest("Basket is empty");

        foreach (var item in basketItems)
        {
            bool alreadyReserved = await _context.Reservations
                .AnyAsync(u => u.MovieId == item.MovieId && u.Username == username);

            if (!alreadyReserved)
            {
                var reservation = new Reservation
                {
                    Username = username,
                    MovieId = item.MovieId,
                    ReservationDate = DateTime.UtcNow,
                    NumberOfTickets = item.Quantity
                    
                };

                _context.Reservations.Add(reservation);
            }
        }

        _context.BasketItems.RemoveRange(basketItems);

        await _context.SaveChangesAsync();
        return Ok("Rezervacije su uspešno napravljene.");
    }

    [HttpGet]
    public async Task<ActionResult<List<int>>> GetUserReservations()
    {
        var user = User?.Identity.Name;

        if (string.IsNullOrEmpty(user)) return Unauthorized();

        var reservations = await _context.Reservations
            .Where(r => r.Username == user)
            .Select(m => m.MovieId)
            .ToListAsync();

        return reservations;
        }

       [HttpPut("toggle-watched/{movieId}")]
        public async Task<ActionResult> ToggleWatchedStatus(int movieId)
        {
            var username = User?.Identity?.Name;

            if (username == null) return Unauthorized();

            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(u => u.Username == username && u.MovieId == movieId);

            if (reservation == null) return NotFound("Nema rezervacije za ovaj film.");

            reservation.IsWatched = !reservation.IsWatched;
            await _context.SaveChangesAsync();

            return Ok($"Film je označen kao {(reservation.IsWatched ? "gledan" : "neglean")}.");
        }

        [HttpDelete("{movieId}")]
        public async Task<ActionResult> CancellationReservation(int movieId)
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();
            
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(u => u.Username == username && u.MovieId == movieId);
            
            if (reservation == null) return BadRequest("Ova rezervacija ne postoji.");
            if (reservation.IsWatched) return BadRequest("Ne možete da otkažete rezervaciju jer ste već pogledali film.");


            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return Ok(new { status = "success", message = "Uspesno brisanje rezervacije." });
        }

        [HttpGet("IsWatched/{movieId}")]
        public async Task<ActionResult<bool>> IsWatched(int movieId)
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Username == username && r.MovieId == movieId);

            if (reservation == null)
                return NotFound("Rezervacija nije pronađena.");

            return Ok(reservation.IsWatched);
        }


    }
}
