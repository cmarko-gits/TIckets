import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../../model/movie.model';

interface CartItem {
  movie: Movie;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>(this.cartItems);

  constructor() {}

  getCartItems() {
    return this.cartSubject.asObservable();
  }

  addToCart(movie: Movie, quantity: number) {
    const existingItem = this.cartItems.find(item => item.movie.movieId === movie.movieId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ movie, quantity });
    }

    this.cartSubject.next(this.cartItems);
  }

  removeFromCart(movieId: number) {
    this.cartItems = this.cartItems.filter(item => item.movie.movieId !== movieId);
    this.cartSubject.next(this.cartItems);
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}
