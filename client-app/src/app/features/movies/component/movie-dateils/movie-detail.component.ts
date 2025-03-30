import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Movie } from '../../model/movie.model';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms'; // Importujte FormsModule
import { CommonModule } from '@angular/common'; // Importujte CommonModule

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], // Dodajte CommonModule
})
export class MovieDetailComponent {
  movie$: Observable<Movie>;
  quantity: number = 1;

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  constructor() {
    const movieId = this.route.snapshot.paramMap.get('id');
    this.movie$ = this.movieService.getMovieById(Number(movieId));
  }

  addToCart(movie: Movie, quantity: number): void {
    this.cartService.addToCart(movie, quantity);
    alert(`${quantity} of ${movie.title} added to your cart.`);
  }
}
