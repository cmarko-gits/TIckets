import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Account';
  private tokenKey = 'jwt_token';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
      }));
  }
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData); // POST request for user registration
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.unique_name || null;
  }
}
