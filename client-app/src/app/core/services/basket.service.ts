import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasketItem } from '../../model/basketItem.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl = `http://localhost:5000/api`; // API URL

  constructor(private http: HttpClient) {}

  // Dohvati stavke iz korpe
  getBasket(): Observable<BasketItem[]> {
    return this.http.get<BasketItem[]>(`${this.apiUrl}/Basket`);
  }

  // Dodaj film u korpu
  addToBasket(movieId: number): Observable<BasketItem> {
    return this.http.post<BasketItem>(`${this.apiUrl}/Basket?movieId=${movieId}`, {});
  }
}
