import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


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