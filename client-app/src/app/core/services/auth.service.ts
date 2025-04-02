import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Account'; // API URL

  constructor(private http: HttpClient) {}

  register(userData: { username: string; email: string; password: string; confirmPassword: string }) {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password
    };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
}
