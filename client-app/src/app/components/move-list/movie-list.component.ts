import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieService } from '../../core/services/movie.service';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { BasketItem } from '../../model/basketItem.model';
import { Movie } from '../../model/movie.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
  ]
})
export class MovieListComponent implements OnInit {
  movies$!: Observable<Movie[]>;

  constructor(
    private movieService: MovieService,
    private basketService: BasketService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.movies$ = this.movieService.getMovies();  // Retrieve movies
  }

  // Add movie to basket
  addToBasket(movie: Movie): void {
    const username = this.authService.getUsername();  // Now it calls getUsername() from AuthService

    if (!username) {
      alert('You must be logged in to add a movie to the basket.');
      return;
    }

    this.basketService.addToBasket(movie.movieId).subscribe({
      next: () => {
        this.snackBar.open(`${movie.title} has been added to the basket`, 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(`Error: ${err.error}`, 'Close', { duration: 2000 });
      }
    });
  }
}
