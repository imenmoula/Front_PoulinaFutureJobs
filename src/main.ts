// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { importProvidersFrom } from '@angular/core';
// import { ToastrModule } from 'ngx-toastr';
// import { AppComponent } from './app/app.component'; // Remplacez par votre composant racine si différent

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideAnimations(), // Nécessaire pour les animations de Toastr
//     importProvidersFrom(ToastrModule.forRoot({
//       positionClass: 'toast-top-right', // Position des notifications
//       preventDuplicates: true, // Évite les doublons
//       timeOut: 5000, // Durée d'affichage en millisecondes
//       progressBar: true, // Affiche une barre de progression
//     })),
//   ],
// }).catch(err => console.error(err));



// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(),
//     importProvidersFrom(ToastrModule.forRoot()) // Ajouter Toastr globalement
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
    provideRouter(routes), // Routage
    provideHttpClient(), // Requêtes HTTP
    provideAnimations(), // Animations (pour routerFadeIn et Toastr)
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right', // Position des notifications
        preventDuplicates: true, // Évite les doublons
        timeOut: 5000, // Durée d'affichage en millisecondes
        progressBar: true // Barre de progression
      })
    ) // Configuration de Toastr
  ]
}).catch(err => console.error(err));