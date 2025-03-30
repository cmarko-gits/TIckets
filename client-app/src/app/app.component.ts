import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Dodaj HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule],  // Dodaj HttpClientModule
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
