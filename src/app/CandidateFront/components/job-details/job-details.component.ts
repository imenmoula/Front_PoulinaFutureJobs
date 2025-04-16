// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { OffreEmploi } from '../../../Models/offre-emploi.model';
// import { Filiale } from '../../../Models/filiale.model';
// import { AuthService } from '../../../shared/services/auth.service';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../../shared/services/filiale.service';
// import { environment } from '../../../../environments/environment.development';

// @Component({
//   selector: 'app-job-details',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './job-details.component.html',
//   styles: []
// })
// export class JobDetailsComponent implements OnInit {
//   offre: OffreEmploi | null = null;
//   filiale: Filiale | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private authService: AuthService,
//     private offreEmploiService: OffreEmploiService,
//     private filialeService: FilialeService
//   ) {}

//   ngOnInit(): void {
//     if (!this.authService.isAuthenticated()) {
//       this.router.navigateByUrl('/signin');
//       return;
//     }

//     const idOffreEmploi = this.route.snapshot.paramMap.get('id');
//     if (idOffreEmploi) {
//       this.loadOffreDetails(idOffreEmploi);
//     } else {
//       console.error('No idOffreEmploi provided');
//       this.router.navigateByUrl('/candidate-only');
//     }
//   }

//   loadOffreDetails(id: string): void {
//     this.offreEmploiService.getOffreById(id).subscribe({
//       next: (offre) => {
//         console.log('Offre fetched:', offre);
//         this.offre = offre;
//         if (offre.idFiliale && !offre.filiale) {
//           this.filialeService.getFiliale(offre.idFiliale).subscribe({
//             next: (filiale) => {
//               this.filiale = filiale;
//               this.offre!.filiale = filiale;
//             },
//             error: (err) => {
//               console.error('Error fetching filiale:', err);
//             }
//           });
//         } else {
//           this.filiale = offre.filiale || null;
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching offre:', err);
//         this.router.navigateByUrl('/candidate-only');
//       }
//     });
//   }

//   getImageUrl(photo: string | undefined): string {
//     if (!photo) return '../../../assets/User/img/default-filiale.jpg';
//     return photo.startsWith('http') ? photo : `${environment.apiBaseUrl}/Uploads/${photo}`;
//   }

//   formatDate(date: any): string {
//     if (!date) return 'Date inconnue';
//     try {
//       const parsedDate = new Date(date);
//       return parsedDate.toLocaleDateString('fr-FR');
//     } catch (error) {
//       console.error('Erreur de format de date:', error);
//       return 'Date inconnue';
//     }
//   }

//   applyNow(): void {
//     // Placeholder for apply functionality
//     console.log('Apply now clicked for offre:', this.offre?.idOffreEmploi);
//     // Implement application logic, e.g., navigate to application form
//     // this.router.navigateByUrl(`/apply/${this.offre?.idOffreEmploi}`);
//   }

//   onLogout(): void {
//     this.authService.deleteToken();
//     this.router.navigateByUrl('/signin');
//   }
// }