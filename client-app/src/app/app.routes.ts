import { Routes } from '@angular/router';
import { MovieListComponent } from './features/movies/component/move-list/movie-list.component';
import { MovieDetailComponent } from './features/movies/component/movie-dateils/movie-detail.component';


export const routes: Routes = [
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
];
