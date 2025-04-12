import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { BasketItem } from '../../model/basketItem.model';  // Importuj model
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';  // Za prikazivanje obaveštenja
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card'; // Import za mat-card
import { MatButtonModule } from '@angular/material/button'; // Import za mat-button
import { MatGridListModule } from '@angular/material/grid-list'; // Import za mat-grid-list
import { MatIconModule } from '@angular/material/icon'; // Ako želiš ikone, možeš dodati i ovaj modul
import { MatToolbarModule } from '@angular/material/toolbar'; // Ako koristiš toolbar
import { MatFormFieldModule } from '@angular/material/form-field'; // Ako koristiš formu
import { MatInputModule } from '@angular/material/input'; // Ako koristiš inpute
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from '../move-list/movie-list.component';
@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule, // Za navigaciju
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    MatListModule 
  ],
})
export class BasketComponent implements OnInit {
  basketItems: BasketItem[] = [];  // Lista stavki u korpi

  constructor(
    private basketService: BasketService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBasket();
  }

  // Učitaj stavke u korpi
  loadBasket(): void {
    if (this.authService.isLoggedIn()) {
      this.basketService.getBasket().subscribe({
        next: (items) => {
          this.basketItems = items;
        },
        error: (err) => {
          console.error('Error loading basket items:', err);
          this.snackBar.open('Greška prilikom učitavanja korpe', 'Zatvori', {
            duration: 2000,
          });
        }
      });
    }
  }

  // Dodaj film u korpu
  addToBasket(movieId: number): void {
    this.basketService.addToBasket(movieId).subscribe({
      next: (item) => {
        this.basketItems.push(item);
        this.snackBar.open('Film je dodat u korpu!', 'Zatvori', {
          duration: 2000,
        });
      },
      error: (err) => {
        console.error('Error adding movie to basket:', err);
        this.snackBar.open('Greška prilikom dodavanja filma u korpu', 'Zatvori', {
          duration: 2000,
        });
      }
    });
  }
}