import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketItem } from '../../model/basketItem.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private baseUrl = 'Basket'; // Pošto ApiService već ima apiUrl

  constructor(private apiService: ApiService) {}

  // Dohvati stavke iz korpe
  getBasket(): Observable<BasketItem[]> {
    return this.apiService.get<BasketItem[]>(this.baseUrl);
  }

  // Dodaj film u korpu
  addToBasket(movieId: number): Observable<BasketItem> {
    return this.apiService.post<BasketItem>(`${this.baseUrl}?movieId=${movieId}`, {});
  }

  removeOne(movieId: number): Observable<any> {
    return this.apiService.post(`Basket/removeOne?movieId=${movieId}`, {});
  }

  removeItem(movieId: number): Observable<any> {
    return this.apiService.delete(`Basket/${movieId}`);  // Pozivamo DELETE metod sa movieId kao parametrom
  }
  
  
}
