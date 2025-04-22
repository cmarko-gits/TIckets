import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BasketService } from '../../core/services/basket.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule ,
    MatMenuModule, 
    CommonModule,
    MatMenuModule
  ]
})
export class HeaderComponent implements OnInit {
  username: string | null = null;
  public basketItemCount: number = 0;

  constructor(
    public authService: AuthService,
    private basketService: BasketService
  ) {}

   ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername();
      this.loadBasketItemCount();
    }
  }

   loadBasketItemCount() {
    this.basketService.getBasket().subscribe(items => {
      this.basketItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }
  
  

  async logout() {
    this.authService.logout();
    this.username = null;
    this.basketItemCount = 0;
  }
}
