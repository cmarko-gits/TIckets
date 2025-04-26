import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { TokenInterceptor } from './core/services/auth.interceptor';
import { routes } from './app.routes';

@NgModule({

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes) 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
})
export class AppModule { }
