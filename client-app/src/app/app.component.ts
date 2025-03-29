import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieService } from './core/services/movie.service';
import { Movie } from './features/movies/movie.model';
import { MovieListComponent } from "./features/movies/movie-list.component";

@Component({
  selector: 'app-root',
  standalone: true, // If using standalone components
  imports: [CommonModule, HttpClientModule, MovieListComponent], // Importing only once
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client-app';
  private movieService = inject(MovieService);

  // Getting the Observable with the list of movies
  $movies: Observable<Movie[]> = this.movieService.getMovies();

  // Track function for better rendering of lists
  trackByMovieId(index: number, movie: Movie): number {
    return movie.movieId;
  }
}
