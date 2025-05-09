import { Routes } from '@angular/router';
import { MovieListComponent } from './components/move-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-dateils/movie-detail.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { BasketComponent } from './components/basket/basket.component';
import { ReservationMoviesComponent } from './components/reservations/reservations.component';



export const routes: Routes = [
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'register' , component : RegisterComponent} ,
  {path : 'login' , component : LoginComponent} ,
  { path: 'basket', component: BasketComponent },
  { path : 'reservation' , component : ReservationMoviesComponent},
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
];
