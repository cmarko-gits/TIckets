import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReservationService } from '../../core/services/reservation.service';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../model/movie.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reservation-movies',
  standalone: true,
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  imports: [CommonModule, MatCardModule, MatIconModule],
})
export class ReservationMoviesComponent implements OnInit {
  userReservations: Movie[] = [];
  isWatchedMap: { [movieId: number]: boolean } = {};

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
              this.checkIfWatched(movie.movieId);
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
  
  checkIfWatched(movieId: number): void {
    this.reservationService.isMovieWatched(movieId).subscribe({
      next: (isWatched) => {
        this.isWatchedMap[movieId] = isWatched;
        console.log(movieId , ": " , isWatched)
      },
      error: (err) => {
        console.error('Greška prilikom provere da li je film pogledan:', err);
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
  
  toggleWatched(movieId: number): void {
    this.reservationService.toggleWatched(movieId).subscribe({
      next: () => {
        this.isWatchedMap[movieId] = !this.isWatchedMap[movieId];
      },
      error: (err) => {
        console.error('Greška prilikom menjanja statusa gledanosti:', err);
      }
    });
  }
  
  }
