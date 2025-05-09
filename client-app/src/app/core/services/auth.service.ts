import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User, UserFormValues } from '../../model/user.mode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private apiService: ApiService, private router: Router) {}

  login(userData: UserFormValues): Observable<User> {
    return this.apiService.post<User>(`Account/login`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Spremanje tokena u localStorage
      })
    );
  }

  register(userData: UserFormValues): Observable<User> {
    return this.apiService.post<User>(`Account/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');  // Brisanje tokena iz localStorage
    this.router.navigate(['/login']);   // Preusmeravanje na login stranicu
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);  // Provera da li je token istekao
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.unique_name || null;  // Vraća korisničko ime iz tokena
    }
    return null;
  }
}
