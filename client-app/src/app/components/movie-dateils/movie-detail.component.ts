import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { MovieService } from '../../core/services/movie.service';
import { BasketService } from '../../core/services/basket.service';
import { Movie } from '../../model/movie.model';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
})
export class MovieDetailComponent {
  movie$: Observable<Movie>;

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private basketService = inject(BasketService);
  private router = inject(Router);

  constructor() {
    const movieId = this.route.snapshot.paramMap.get('id');
    this.movie$ = this.movieService.getMovieById(Number(movieId));
  }

  addToCart(movie: Movie) {
    this.basketService.addToBasket(movie.movieId).subscribe(() => {
      this.router.navigate(['/basket']);
    });
  }
}
