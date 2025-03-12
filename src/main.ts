
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import feather from 'feather-icons';
import { importProvidersFrom } from '@angular/core';


feather.replace(); // Initialiser Feather Icons

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), 
    importProvidersFrom(
      BrowserAnimationsModule, // Obligatoire pour ngx-toastr
      ToastrModule.forRoot({
        positionClass: 'toast-top-right', // Position du toast
        timeOut: 3000, // Durée d'affichage
        progressBar: true,
      }),
     ),
  ],
}).catch((err) => console.error('Bootstrap error:', err));