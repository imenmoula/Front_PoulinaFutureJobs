// // job-listing.component.ts

// import { Component, Input, OnInit } from '@angular/core';
// import { OffreEmploi } from '../../../Models/offre-emploi.model';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';


// @Component({
//   selector: 'app-job-listing',
//   templateUrl: './job-listing.component.html',
//   styleUrls: ['./job-listing.component.css']
// })
// export class JobListingComponent implements OnInit {
//   offres: OffreEmploi[] = [];
//   @Input() offres: OffreEmploi[] = []; // Use Input to receive offers

//   constructor(private offreEmploiService: OffreEmploiService) { }

//   ngOnInit(): void {
//     this.loadOffres();
//   }

//   loadOffres(): void {
//     this.offreEmploiService.getAllOffres().subscribe(
//       (offres) => {
//         this.offres = offres;
//       },
//       (error) => {
//         console.error('Erreur lors de la récupération des offres:', error);
//       }
//     );
//   }

//   formatDate(date: any): string {
//     if (date) {
//       try {
//         const parsedDate = new Date(date);
//         return parsedDate.toLocaleDateString('fr-FR');
//       } catch (error) {
//         console.error('Erreur de format de date:', error);
//         return 'Date inconnue';
//       }
//     }
//     return 'Date inconnue';
//   }

  

//   timeSince(date: any): string {
//       const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
//       let interval = seconds / 31536000;

//       if (interval > 1) {
//           return "il y a " + Math.floor(interval) + " ans";
//       }
//       interval = seconds / 2592000;
//       if (interval > 1) {
//           return "il y a " + Math.floor(interval) + " mois";
//       }
//       interval = seconds / 86400;
//       if (interval > 1) {
//           return "il y a " + Math.floor(interval) + " jours";
//       }
//       interval = seconds / 3600;
//       if (interval > 1) {
//           return "il y a " + Math.floor(interval) + " heures";
//       }
//       interval = seconds / 60;
//       if (interval > 1) {
//           return "il y a " + Math.floor(interval) + " minutes";
//       }
//       return "il y a " + Math.floor(seconds) + " secondes";
//   }
  
// }
