import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports : [
    MatButtonModule, MatToolbarModule , CommonModule
  ]
})
export class FooterComponent {
  year: number = new Date().getFullYear(); // To dynamically display the current year
}
