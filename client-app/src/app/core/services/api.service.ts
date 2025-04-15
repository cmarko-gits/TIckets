import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) {}

  private setAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  

  get<T>(url: string, params?: any): Observable<T> {
    const headers = this.setAuthHeaders();
    return this.http.get<T>(`${this.apiUrl}${url}`, { headers, params });
  }

  post<T>(url: string, body: any): Observable<T> {
    const headers = this.setAuthHeaders();
    return this.http.post<T>(`${this.apiUrl}${url}`, body, { headers });
  }

  delete<T>(url: string, params?: any): Observable<T> {
    const headers = this.setAuthHeaders();
    return this.http.delete<T>(`${this.apiUrl}${url}`, { headers, params });
  }
  
}
