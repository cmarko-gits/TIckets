import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Movie } from './movie.model';  // Update with actual path
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,  // If you're using standalone components
  imports: [CommonModule], // Make sure to import CommonModule for async pipe
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent {
  private movieService = inject(MovieService);

  // Observable list of movies
  $movies: Observable<Movie[]> = this.movieService.getMovies();

  // TrackBy function to optimize ngFor loop
  trackByMovieId(index: number, movie: Movie): number {
    return movie.movieId;
  }
}
