import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [MatButtonModule, MatToolbarModule , CommonModule]
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();  // Set the username on initialization
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
