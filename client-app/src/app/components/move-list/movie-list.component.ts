import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { HttpClientModule } from '@angular/common/http';  // Importuj HttpClientModule
import { RouterModule } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../model/movie.model';

  @Component({
    selector: 'app-movie-list',
    standalone: true,
    imports: [CommonModule, RouterModule],  // Add RouterModule here
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.css'],
  })
export class MovieListComponent {
  private movieService = inject(MovieService);
  $movies: Observable<Movie[]> = this.movieService.getMovies();

  trackByMovieId(index: number, movie: Movie): number {
    return movie.movieId;
  }
}
