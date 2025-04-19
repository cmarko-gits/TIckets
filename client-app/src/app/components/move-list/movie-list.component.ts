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
import { MatCheckboxModule } from '@angular/material/checkbox';  // Dodaj MatCheckboxModule
import { MatIconModule } from '@angular/material/icon';  // Ako koristiš ikone u `mat-checkbox`

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
    MatNativeDateModule,
    MatCheckboxModule,  // Dodaj MatCheckboxModule za checkbox u selektovanju žanrova
    MatIconModule,  // Dodaj ako koristiš ikone
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
    private fb: FormBuilder,
    private router: Router // Dodano za navigaciju
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchTerm: '',
      genres: [],
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

    this.movies$ = this.movieService.getFilteredMovies(filters);
  }

  isGenreSelected(genre: string): boolean {
    return this.filterForm.value.genres?.includes(genre);
  }

  onGenreChange(genre: string, event: any): void {
    const selectedGenres = this.filterForm.get('genres')?.value;

    if (event.checked) {
      selectedGenres.push(genre);
    } else {
      const index = selectedGenres.indexOf(genre);
      if (index > -1) {
        selectedGenres.splice(index, 1);
      }
    }
  }

  onFilter(): void {
    const filters = this.filterForm.value;
    this.getFilteredMovies(
      filters.searchTerm, filters.genres, filters.actors, filters.director,
      filters.minDuration, filters.maxDuration, filters.startDate,
      filters.endDate, filters.orderBy
    );
  }

  addToBasket(movie: Movie): void {
    const username = this.authService.getUsername();  
    if (!username) {
      this.router.navigate(['/login']);
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

  private fetchMovies(): void {
    this.movies$ = this.movieService.getMovies();
  }
}
