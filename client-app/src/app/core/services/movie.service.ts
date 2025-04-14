import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:5000/api/Movie';
  private http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }
  getGenresAsString(genres: any[]): string {
    console.log(genres)
    return genres.map(g => g.genre.name).join(', ');
  }
  
  // Add this method to handle filtered movies
  getFilteredMovies(filters: any): Observable<Movie[]> {
    let params = new HttpParams();

    // Append the filters to the HTTP params
    if (filters.searchTerm) {
      params = params.append('searchTerm', filters.searchTerm);
    }
    if (filters.genres) {
      params = params.append('genres', filters.genres);
    }
    if (filters.actors) {
      params = params.append('actors', filters.actors);
    }
    if (filters.director) {
      params = params.append('director', filters.director);
    }
    if (filters.minDuration) {
      params = params.append('minDuration', filters.minDuration.toString());
    }
    if (filters.maxDuration) {
      params = params.append('maxDuration', filters.maxDuration.toString());
    }
    if (filters.startDate) {
      params = params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.append('endDate', filters.endDate);
    }
    if (filters.orderBy) {
      params = params.append('orderBy', filters.orderBy);
    }

    return this.http.get<Movie[]>(`${this.apiUrl}`, { params });
  }
}
