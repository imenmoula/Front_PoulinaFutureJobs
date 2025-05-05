// import { AuthService } from './../../../shared/services/auth.service';
// // import { Component, OnInit } from '@angular/core';
// // import { OffreEmploi } from '../../../Models/offre-emploi.model';
// // import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// // import { FilialeService } from '../../../shared/services/filiale.service';
// // import { Filiale } from '../../../Models/filiale.model';
// // import { FormsModule } from '@angular/forms';
// // import { CommonModule } from '@angular/common';
// // import { TypeContratEnum } from '../../../Models/enums.model';
// // import { Router, RouterModule } from '@angular/router';

// // @Component({
// //   selector: 'app-job-listing',
// //   standalone: true,
// //   imports: [FormsModule, CommonModule,RouterModule],
// //   templateUrl: './job-listing.component.html',
// //   styleUrls: [
// //     './job-listing.component.css',
// //     '../../../../assets/User/css/bootstrap.min.css',
// //     '../../../../assets/User/css/owl.carousel.min.css',
// //     '../../../../assets/User/css/flaticon.css',
// //     '../../../../assets/User/css/price_rangs.css',
// //     '../../../../assets/User/css/slicknav.css',
// //     '../../../../assets/User/css/animate.min.css',
// //     '../../../../assets/User/css/magnific-popup.css',
// //     '../../../../assets/User/css/fontawesome-all.min.css',
// //     '../../../../assets/User/css/themify-icons.css',
// //     '../../../../assets/User/css/slick.css',
// //     '../../../../assets/User/css/nice-select.css',
// //     '../../../../assets/User/css/style.css'
// //   ]
// // })
// // export class JobListingComponent implements OnInit {
// //   offres: OffreEmploi[] = [];
// //   filteredOffres: OffreEmploi[] = [];
// //   filiales: { [key: string]: Filiale } = {};
// //   filialesList: Filiale[] = []; // List of filiales for the dropdown
// //   specialite: string = '';
// //   typeContrat: string = '';
// //   modeTravail: string = '';
// //   selectedFiliale: string = ''; // Selected filiale ID

// //   // Pagination properties
// //   currentPage: number = 1;
// //   itemsPerPage: number = 5;
// //   totalPages: number = 1;

// //   constructor(
// //     private offreService: OffreEmploiService,
// //     private filialeService: FilialeService,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.loadOffres();
// //     this.loadFiliales();
// //   }

// //   loadOffres(): void {
// //     this.offreService.getAllOffres().subscribe(
// //       (data: OffreEmploi[]) => {
// //         this.offres = data;
// //         this.filterOffres();
// //         this.updatePagination();
// //       },
// //       (error: any) => {
// //         console.error('Error loading offers:', error);
// //       }
// //     );
// //   }

// //   loadFiliales(): void {
// //     this.filialeService.getFiliales().subscribe(
// //       (data: Filiale[]) => {
// //         this.filialesList = data; // Store the list for the dropdown
// //         this.filiales = data.reduce((acc, filiale) => {
// //           acc[filiale.idFiliale] = filiale;
// //           return acc;
// //         }, {} as { [key: string]: Filiale });
// //       },
// //       (error: any) => {
// //         console.error('Error loading filiales:', error);
// //       }
// //     );
// //   }

// //   filterOffres(): void {
// //     this.offreService.searchOffres(
// //       this.specialite,
// //       '',
// //       this.typeContrat,
// //       '',
// //       this.modeTravail,
// //       this.selectedFiliale // Pass the selected filiale ID
// //     ).subscribe(
// //       (data) => {
// //         this.filteredOffres = data.offresEmploi || [];
// //         this.updatePagination();
// //       },
// //       (error) => {
// //         console.error('Error filtering offers:', error);
// //       }
// //     );
// //   }

// //   onFilterChange(): void {
// //     this.currentPage = 1; // Reset to first page on filter change
// //     this.filterOffres();
// //   }

// //   updatePagination(): void {
// //     this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
// //   }

// //   getPaginatedOffres(): OffreEmploi[] {
// //     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
// //     const endIndex = startIndex + this.itemsPerPage;
// //     return this.filteredOffres.slice(startIndex, endIndex);
// //   }

// //   nextPage(): void {
// //     if (this.currentPage < this.totalPages) {
// //       this.currentPage++;
// //     }
// //   }

// //   prevPage(): void {
// //     if (this.currentPage > 1) {
// //       this.currentPage--;
// //     }
// //   }

// //   getPages(): number[] {
// //     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
// //   }

// //   getContractColor(typeContrat: TypeContratEnum): string {
// //     switch (typeContrat) {
// //       case TypeContratEnum.CDI:
// //         return '#28a745'; // Green
// //       case TypeContratEnum.CDD:
// //         return '#007bff'; // Blue
// //       case TypeContratEnum.Freelance:
// //         return '#ffc107'; // Yellow
// //       case TypeContratEnum.Stage:
// //         return '#dc3545'; // Red
// //       default:
// //         return '#6c757d'; // Gray
// //     }
// //   }
 
// // }

// import { Component, OnInit } from '@angular/core';
// import { OffreEmploi } from '../../../Models/offre-emploi.model';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../../shared/services/filiale.service';
// import { Filiale } from '../../../Models/filiale.model';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { TypeContratEnum } from '../../../Models/enums.model';

// interface OffreByFiliale {
//   filiale: Filiale;
//   offreCount: number;
// }

// @Component({
//   selector: 'app-job-listing',
//   standalone: true,
//   imports: [FormsModule, CommonModule, RouterModule],
//   templateUrl: './job-listing.component.html',
//   styleUrls: [
//     './job-listing.component.css',
//     '../../../../assets/User/css/bootstrap.min.css',
//     '../../../../assets/User/css/owl.carousel.min.css',
//     '../../../../assets/User/css/flaticon.css',
//     '../../../../assets/User/css/price_rangs.css',
//     '../../../../assets/User/css/slicknav.css',
//     '../../../../assets/User/css/animate.min.css',
//     '../../../../assets/User/css/magnific-popup.css',
//     '../../../../assets/User/css/fontawesome-all.min.css',
//     '../../../../assets/User/css/themify-icons.css',
//     '../../../../assets/User/css/slick.css',
//     '../../../../assets/User/css/nice-select.css',
//     '../../../../assets/User/css/style.css'
//   ]
// })
// export class JobListingComponent implements OnInit {
//   offres: OffreEmploi[] = [];
//   filteredOffres: OffreEmploi[] = [];
//   offresByFiliale: OffreByFiliale[] = [];
//   filiales: { [key: string]: Filiale } = {};
//   filialesList: Filiale[] = [];
//   specialite: string = '';
//   typeContrat: string = '';
//   modeTravail: string = '';
//   selectedFiliale: string = '';
//   selectedFilialeForOffers: string | null = null;

//   currentPage: number = 1;
//   itemsPerPage: number = 5;
//   totalPages: number = 1;

//   constructor(
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const idFiliale = params['idFiliale'];
//       if (idFiliale) {
//         this.selectedFilialeForOffers = idFiliale;
//         this.selectedFiliale = idFiliale;
//       }
//       this.loadFiliales();
//       this.loadOffres();
//     });
//   }

//   loadOffres(): void {
//     this.offreService.getAllOffres().subscribe(
//       (offres: OffreEmploi[]) => {
//         console.log('Réponse brute de l\'API (offres):', JSON.stringify(offres, null, 2));
//         this.offres = offres || [];
//         this.calculateOffresByFiliale();
//         this.filterOffres();
//       },
//       (error: any) => {
//         console.error('Error loading offers:', error);
//       }
//     );
//   }

//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe(
//       (filiales: Filiale[]) => {
//         console.log('Réponse brute de l\'API (filiales):', JSON.stringify(filiales, null, 2));
//         this.filialesList = filiales || [];
//         this.filiales = this.filialesList.reduce((acc, filiale) => {
//           acc[filiale.idFiliale] = filiale;
//           return acc;
//         }, {} as { [key: string]: Filiale });
//       },
//       (error: any) => {
//         console.error('Error loading filiales:', error);
//       }
//     );
//   }

//   calculateOffresByFiliale(): void {
//     const offreCounts: { [key: string]: number } = {};
//     this.offres.forEach(offre => {
//       const idFiliale = offre.idFiliale;
//       if (idFiliale) {
//         offreCounts[idFiliale] = (offreCounts[idFiliale] || 0) + 1;
//       }
//     });

//     this.offresByFiliale = this.filialesList
//       .map(filiale => ({
//         filiale,
//         offreCount: offreCounts[filiale.idFiliale] || 0
//       }))
//       .filter(item => item.offreCount > 0);
//   }

//   filterOffres(): void {
//     this.offreService.searchOffres(
//       this.specialite,
//       '',
//       this.typeContrat,
//       '',
//       this.modeTravail,
//       this.selectedFilialeForOffers || this.selectedFiliale
//     ).subscribe(
//       (response: { offresEmploi: OffreEmploi[] }) => {
//         console.log('Réponse brute de l\'API (filtered offres):', JSON.stringify(response, null, 2));
//         this.filteredOffres = response.offresEmploi || [];
//         this.updatePagination();
//       },
//       (error) => {
//         console.error('Error filtering offers:', error);
//       }
//     );
//   }

//   navigateToFilialeOffres(idFiliale: string): void {
//     this.selectedFilialeForOffers = idFiliale;
//     this.currentPage = 1;
//     this.filterOffres();
//     document.querySelector('.job-listing-area')?.scrollIntoView({ behavior: 'smooth' });
//   }

//   onFilterChange(): void {
//     this.selectedFilialeForOffers = null;
//     this.currentPage = 1;
//     this.filterOffres();
//   }

//   updatePagination(): void {
//     this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
//   }

//   getPaginatedOffres(): OffreEmploi[] {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     return this.filteredOffres.slice(startIndex, endIndex);
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//     }
//   }

//   prevPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   getPages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   getContractColor(typeContrat: TypeContratEnum): string {
//     switch (typeContrat) {
//       case TypeContratEnum.CDI:
//         return '#28a745';
//       case TypeContratEnum.CDD:
//         return '#007bff';
//       case TypeContratEnum.Freelance:
//         return '#ffc107';
//       case TypeContratEnum.Stage:
//         return '#dc3545';
//       case TypeContratEnum.Alternance:
//         return '#17a2b8';
//       default:
//         return '#6c757d';
//     }
//   }

//   shortenGuid(guid: string): string {
//     return guid.substring(0, 8);
//   }
//   onLogout(): void {
//     this.authService.deleteToken();
//     this.router.navigateByUrl('/signin');
//   }
//  // Dans job-list.component.ts
// viewJobDetails(idOffre: string) {
//   if (!idOffre) {
//     console.error('ID de l\'offre manquant');
//     return;
//   }
  
//   console.log('Navigation vers les détails de l\'offre:', idOffre);
//   this.router.navigate(['/job-details', idOffre]);
// }

//   formatDate(date: any): string {
//     if (!date) return 'Non spécifié';
//     try {
//       return new Date(date).toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch (e) {
//       console.error('Erreur de formatage de date:', e);
//       return 'Date invalide';
//     }
//   }

//   timeSince(date: any): string {
//     if (!date) return 'Inconnu';
//     const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
//     let interval = seconds / 31536000; // Years

//     if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
//     interval = seconds / 2592000; // Months
//     if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
//     interval = seconds / 86400; // Days
//     if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
//     interval = seconds / 3600; // Hours
//     if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
//     interval = seconds / 60; // Minutes
//     if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
//     return `il y a ${Math.floor(seconds)} secondes`;
//   }
// }