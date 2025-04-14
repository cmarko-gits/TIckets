import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieService } from '../../core/services/movie.service';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { Movie } from '../../model/movie.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatToolbarModule,
    RouterModule,
    MatNativeDateModule ,
    ReactiveFormsModule
  ]
})
export class MovieListComponent implements OnInit {
  movies$!: Observable<Movie[]>;
  filterForm!: FormGroup;

  constructor(
    private movieService: MovieService,
    private basketService: BasketService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchTerm: '',
      genres: '',
      actors: '',
      director: '',
      minDuration: '',
      maxDuration: '',
      startDate: '',
      endDate: '',
      orderBy: ''
    });

    this.fetchMovies();  // Load movies when the component initializes
  }
  getGenresAsString(genres: any[]): string {
    return genres.map(g => g.genre.name).join(', ');
  }
  
  getFilteredMovies(
    searchTerm: string, 
    genres: string, 
    actors: string, 
    director: string, 
    minDuration: number, 
    maxDuration: number, 
    startDate: string, 
    endDate: string, 
    orderBy: string
  ): void {
    const filters = {
      searchTerm, genres, actors, director, minDuration, maxDuration, startDate, endDate, orderBy
    };

    // Call the service to fetch the filtered movies
    this.movies$ = this.movieService.getFilteredMovies(filters);
  }
  
  // Filter movies based on the form values
  onFilter(): void {
    const filters = this.filterForm.value;
    this.getFilteredMovies(
      filters.searchTerm, filters.genres, filters.actors, filters.director, 
      filters.minDuration, filters.maxDuration, filters.startDate, 
      filters.endDate, filters.orderBy
    );
  }

  // Add movie to basket
  addToBasket(movie: Movie): void {
    const username = this.authService.getUsername();  // Get username from AuthService
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

  // Fetch all movies initially
  private fetchMovies(): void {
    this.movies$ = this.movieService.getMovies();
  }
}
