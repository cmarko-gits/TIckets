import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../model/movie.model';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reservation-movies',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule]  
})
export class ReservationMoviesComponent implements OnInit {
  userReservations: Movie[] = [];
  isWatchedMap: { [movieId: number]: boolean } = {};
  isRatedMap: { [movieId: number]: boolean } = {};
  rateMap: { [movieId: number]: number } = {}; 

  constructor(
    private reservationService: ReservationService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getUserReservations().subscribe({
      next: (movieIds: number[]) => {
        const movieRequests = movieIds.map(id =>
          this.movieService.getMovieById(id)
        );

        forkJoin(movieRequests).subscribe({
          next: (movies) => {
            this.userReservations = movies.filter((movie): movie is Movie => !!movie);

            // Ovde pozivamo proveru za svaki film
            this.userReservations.forEach(movie => {
              this.checkIfMovieRated(movie.movieId).subscribe(isRated => {
                this.isRatedMap[movie.movieId] = isRated;
              });
              this.checkIfWatched(movie.movieId);
              this.getRating(movie.movieId); // Fetch rating for each movie
            });
          },
          error: err => {
            console.error('Greška prilikom dobijanja filmova:', err);
          }
        });
      },
      error: err => {
        console.error('Greška prilikom učitavanja rezervacija:', err);
      }
    });
  }

  checkIfMovieRated(movieId: number): Observable<boolean> {
    return this.reservationService.isMovieRated(movieId); 
  }

  checkIfWatched(movieId: number): void {
    this.reservationService.isMovieWatched(movieId).subscribe({
      next: (isWatched) => {
        this.isWatchedMap[movieId] = isWatched;
      },
      error: (err) => {
        console.error('Greška prilikom provere da li je film pogledan:', err);
      }
    });
  }

  toggleWatched(movieId: number): void {
    this.reservationService.toggleWatched(movieId).subscribe({
      next: (response) => {
        console.log(response);
        this.checkIfWatched(movieId); 
      },
      error: (err) => {
        console.error('Greška prilikom promene statusa gledanosti:', err);
      }
    });
  }

  cancelReservation(id: number): void {
    this.reservationService.cancelReservation(id).subscribe({
      next: (message: string) => {
        console.log(message); // "Uspesno brisanje rezervacije."
        this.userReservations = this.userReservations.filter(r => r.movieId !== id);
      },
      error: (err) => {
        console.error('Greška prilikom otkazivanja rezervacije:', err);
      }
    });
  }

  rateMovie(movieId: number, rating: number): void {
    // Ensure the movie is watched before allowing the user to rate it
    const reservation = this.userReservations.find(movie => movie.movieId === movieId);
    
    if (reservation && this.isWatchedMap[movieId]) {
      this.reservationService.rateMovie(movieId, rating).subscribe({
        next: (response) => {
          console.log('Ocena postavljena:', response);
          reservation.rating = rating;
        },
        error: (err) => {
          console.error('Greška prilikom postavljanja ocene:', err);
        }
      });
    } else {
      console.error('Film mora biti označen kao gledan pre nego što ga ocenite.');
    }
  }

  getRating(movieId: number): void {
    if (this.rateMap[movieId] !== undefined) {
      return; 
    }
  
    this.reservationService.getRating(movieId).subscribe({
      next: (rating) => {
        console.log(rating)
        this.rateMap[movieId] = rating; 
      },
      error: (err) => {
        console.error('Greška prilikom dobijanja ocene:', err);
      }
    });
  }
}
