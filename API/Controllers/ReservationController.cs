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
        
        [HttpGet("is-rated/{movieId}")]
        public async Task<ActionResult<bool>> IsMovieRated(int movieId)
        {
            var username = User?.Identity?.Name;  // Preuzimanje korisničkog imena iz identifikacije

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized(); // Ako korisnik nije prijavljen, vraćamo Unauthorized
            }

            // Pronađi rezervaciju za dati film i korisnika
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Username == username && r.MovieId == movieId);

            if (reservation == null)
            {
                return NotFound("Rezervacija za ovaj film nije pronađena.");
            }

            // Ako film ima ocenu (rating), vraćamo true
            return Ok(reservation.Rating.HasValue); // Ako je Rating null, vraćamo false
        }
        [HttpPost("rate/{movieId}")]
        public async Task<ActionResult> RateMovie(int movieId, [FromBody] RatingRequest ratingRequest)
        {
            var username = User?.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Username == username && r.MovieId == movieId);

            if (reservation == null)
                return NotFound("Nema rezervacije za ovaj film.");
            
            // Provera da li je film već ocenjen
            if (reservation.Rating.HasValue)
                return BadRequest("Film je već ocenjen.");

            // Provera da li je film označen kao gledan
            if (!reservation.IsWatched)
                return BadRequest("Film mora biti označen kao gledan pre nego što ga ocenite.");

            // Ažuriranje ocene
            reservation.Rating = ratingRequest.Rating;
            reservation.IsWatched = true; // Postavljanje statusa gledanog filma
            await _context.SaveChangesAsync();

            return Ok("Ocena je uspešno postavljena.");
        }

[HttpGet("get-rating/{movieId}")]
public async Task<ActionResult<int>> GetRating(int movieId)
{
    var username = User?.Identity?.Name;

    if (string.IsNullOrEmpty(username))
    {
        return Unauthorized(); // Ako korisnik nije prijavljen, vraćamo Unauthorized
    }

    // Pronađi rezervaciju za dati film i korisnika
    var reservation = await _context.Reservations
        .FirstOrDefaultAsync(r => r.Username == username && r.MovieId == movieId);

    if (reservation == null)
    {
        return NotFound("Film nije rezervisan od strane korisnika");
    }

    // Proveri da li je film ocenjen
    if (reservation.Rating == null || reservation.Rating <= 0)
    {
        return Ok(0); // Ako film nije ocenjen, vraćamo 0
    }

    return Ok(reservation.Rating); // Vratite ocenu filma ako postoji
}



        }

    public class RatingRequest
{
    public int Rating { get; set; }
}

}