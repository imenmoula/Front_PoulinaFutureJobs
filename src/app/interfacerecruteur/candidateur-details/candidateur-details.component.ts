// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Candidature } from '../../Models/Candidature.model';
// import { CandidateurSharedService } from '../../shared/services/candidateur-shared.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { ModeTravail, TypeContratEnum } from '../../Models/enums.model';

// @Component({
//   selector: 'app-candidature-detail',
//   standalone: true,
//   imports: [CommonModule,FormsModule,ReactiveFormsModule],
//   templateUrl: './candidateur-details.component.html',
//   styleUrls: ['./candidateur-details.component.css']
// })
// export class CandidateurDetailsComponent implements OnInit {
//   candidature: Candidature | null = null;
//   offre: OffreEmploi | null = null;
//   errorMessage: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private candidatureService: CandidateurSharedService,
//     private offreEmploiService: OffreEmploiService
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.loadCandidature(id);
//     } else {
//       this.errorMessage = 'Erreur: ID de candidature manquant.';
//       console.error('No ID provided in the route');
//     }
//   }

//   loadCandidature(id: string): void {
//     this.candidatureService.getCandidatureById(id).subscribe({
//       next: (data) => {
//         this.candidature = data;
//         console.log('Candidature details loaded:', this.candidature);
//         if (this.candidature?.offreId) {
//           this.loadOffre(this.candidature.offreId);
//         } else {
//           this.errorMessage = 'Erreur: ID de l\'offre manquant dans la candidature.';
//         }
//       },
//       error: (error) => {
//         this.errorMessage = 'Erreur lors du chargement des détails de la candidature: ' + error.message;
//         console.error('Error loading candidature details:', error);
//       }
//     });
//   }

//   loadOffre(offreId: string): void {
//     this.offreEmploiService.getOffreEmploi(offreId).subscribe({
//       next: (offreData) => {
//         this.offre = offreData;
//         console.log('Offre details loaded:', this.offre);
//         if (this.candidature) {
//           if (this.offre) {
//             this.candidature.offre = this.offre;
//           }
//         }
//       },
//       error: (error) => {
//         this.errorMessage = 'Erreur lors du chargement des détails de l\'offre: ' + error.message;
//         console.error('Error loading offre details:', error);
//       }
//     });
//   }

//   getTypeContratString(typeContrat: TypeContratEnum | null | undefined): string {
//     if (typeContrat == null) {
//       return 'Non disponible';
//     }
//     return TypeContratEnum[typeContrat] || 'Non disponible';
//   }

//   getModeTravailString(modeTravail: ModeTravail | null | undefined): string {
//     if (modeTravail == null) {
//       return 'Non disponible';
//     }
//     return ModeTravail[modeTravail] || 'Non disponible';
//   }
// }