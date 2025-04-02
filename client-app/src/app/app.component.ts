import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Dodaj HttpClientModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importuj oba modula

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],  // Dodaj FormsModule i ReactiveFormsModule
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
