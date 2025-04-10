import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent , MatCardModule,    MatCardModule,
    MatFormFieldModule,  // Dodaj ovo
    MatInputModule,      // Dodaj ovo
    MatButtonModule,
    HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>   `,
  styles: [`
    .content {
      padding-top: 80px;
      padding-bottom: 60px;
      min-height: calc(100vh - 140px);
      background: linear-gradient(135deg, #2c3e50, #34495e);
      color: #ecf0f1;
    }
  `]
})
export class AppComponent { }
