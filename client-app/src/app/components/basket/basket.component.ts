import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BasketService } from '../../core/services/basket.service';
import { BasketItem } from '../../model/basketItem.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  basketItems: BasketItem[] = [];

  constructor(private basketService: BasketService, private router: Router) {}

  ngOnInit() {
    this.loadBasket();
  }

  loadBasket() {
    this.basketService.getBasket().subscribe(items => {
      this.basketItems = items;
    });
  }

  increaseQuantity(item: BasketItem) {
    this.basketService.addToBasket(item.movieId).subscribe(() => {
      item.quantity++;
    });
  }

  decreaseQuantity(item: BasketItem) {
    if (item.quantity > 1) {
      this.basketService.removeOne(item.movieId).subscribe(() => {
        item.quantity--;
      });
    }
  }
  removeItem(movieId: number) {
  this.basketService.removeItem(movieId).subscribe({
    next: () => {
      this.basketItems = this.basketItems.filter(item => item.movieId !== movieId);
    },
    error: err => {
      console.error('Greška pri brisanju filma iz korpe', err);
    }
  });
}
reserve() {
  this.basketService.reserveFromBasket().subscribe({
    next: () => {
      this.basketItems = []; 
      this.router.navigate(['/reservation']); 
    } ,
    error : () =>{
      this.router.navigate(['/reservation']); 

    }
  });
}
get totalTickets(): number {
  return this.basketItems.reduce((sum, item) => sum + item.quantity, 0);
}



}
