// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { importProvidersFrom } from '@angular/core';
// import { ToastrModule } from 'ngx-toastr';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes), // Routage
//     provideHttpClient(), // Requêtes HTTP
//     provideAnimations(), // Animations (pour routerFadeIn et Toastr)
//     importProvidersFrom(
//       ToastrModule.forRoot({
//         positionClass: 'toast-top-right', // Position des notifications
//         preventDuplicates: true, // Évite les doublons
//         timeOut: 5000, // Durée d'affichage en millisecondes
//         progressBar: true // Barre de progression
//       })
//     ) // Configuration de Toastr
//   ]
// }).catch(err => console.error(err));



import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-center', // Changed to bottom-right
        preventDuplicates: true,
        timeOut: 5000,
        progressBar: true,
      })
    ),
  ],
}).catch((err) => console.error(err));