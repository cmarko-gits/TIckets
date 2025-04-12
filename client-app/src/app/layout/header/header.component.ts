import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule, // ✅ Obavezno za *ngIf
    MatButtonModule, // Dodaj button module
    MatToolbarModule // Dodaj toolbar module
  ]
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
