import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Account'; // API URL

  constructor(private http: HttpClient) {}

  // Registracija korisnika
  register(userData: { username: string; email: string; password: string; confirmPassword: string }) {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password
    };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  // Login korisnika i sačuvaj token u localStorage
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username); // 👈 Sačuvaj username
        }
      })
    );
  }
  
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
  
  // Metoda za logout (uklanjanje tokena iz localStorage)
  logout(){
    // Obriši token iz localStorage prilikom logovanja
    localStorage.removeItem('token');
  }

  // Metoda za dobijanje tokena iz localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Metoda za proveru da li je korisnik ulogovan
  isLoggedIn(): boolean {
    return !!this.getToken();
  }


}
