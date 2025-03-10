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
//  }).catch(err => console.error(err));






// // import { bootstrapApplication } from '@angular/platform-browser';
// // import { provideRouter } from '@angular/router';
// // import { provideHttpClient } from '@angular/common/http';
// // import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
// // import { importProvidersFrom } from '@angular/core';
// // import { ToastrModule } from 'ngx-toastr';
// // import { AppComponent } from './app/app.component';
// // import { routes } from './app/app.routes';
// // import feather from 'feather-icons';

// // feather.replace();

// // bootstrapApplication(AppComponent, {
// //   providers: [
// //     provideRouter(routes),
// //     provideHttpClient(),
// //     provideAnimations(),
// //     BrowserAnimationsModule, // Nécessaire pour les animations de Toastr
// //     ToastrModule.forRoot({ // Configuration globale de Toastr
// //       positionClass: 'toast-top-center', // Position en haut au centre (vous pouvez aussi utiliser 'toast-top-right', 'toast-top-left', etc.)
// //       timeOut: 5000, // Durée d'affichage en millisecondes (5 secondes)
// //       closeButton: true, // Bouton de fermeture
// //       progressBar: true, // Barre de progression
// //     }),
    
// //   ],

// // }).catch((err) => console.error(err));

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