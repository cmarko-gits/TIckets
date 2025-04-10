import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Movie } from '../../model/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatGridListModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatSidenavModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies$!: Observable<Movie[]>;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movies$ = this.movieService.getMovies();
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.movieId;
  }

  toggleDescription(movie: Movie): void {
    movie.isDescriptionExpanded = !movie.isDescriptionExpanded;
  }
}
