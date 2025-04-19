// core/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
    private baseUrl = 'Reservation';

    constructor(private api: ApiService) {}

    getUserReservations(): Observable<number[]> {
      return this.api.get<number[]>(this.baseUrl);
    }

    cancelReservation(id: number): Observable<any> {
      return this.api.delete(`Reservation/${id}`);
    }
    isMovieWatched(movieId: number): Observable<boolean> {
      return this.api.get<boolean>(`Reservation/IsWatched/${movieId}`);
    }
    toggleWatched(movieId: number): Observable<any> {
      return this.api.put(`Reservation/toggle-watched/${movieId}`, {});
    }
    
    rateMovie(movieId: number, rating: number): Observable<any> {
      return this.api.post(`Reservation/rate/${movieId}`, { rating });
    }
    isMovieRated(movieId: number): Observable<boolean> {
      return this.api.get<boolean>(`Reservation/is-rated/${movieId}`);
    }
    getRating(movieId:number) : Observable<number>{
      return this.api.get<number>(`Reservation/get-rating/${movieId}`)
    }
  

}
