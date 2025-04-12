import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from './app/app.routes';
import { MatCardModule } from '@angular/material/card';
import { TokenInterceptor } from './app/core/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MatCardModule
    )
  ],
}).catch(err => console.error(err));
