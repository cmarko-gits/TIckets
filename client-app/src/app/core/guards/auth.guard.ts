import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Ako korisnik JESTE ulogovan, redirektuj ga na '/movies'
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/movies']);
      return false;  // Ne dozvoljava pristup stranici
    }
    return true;  // Dozvoljava pristup stranici ako nije ulogovan
  }
}
