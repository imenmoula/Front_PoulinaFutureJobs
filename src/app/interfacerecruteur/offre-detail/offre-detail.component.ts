

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { UserService } from '../../shared/services/user.service';
import { catchError, Observable, of, forkJoin as rxjsForkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offre-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offre-detail.component.html',
  styleUrls: ['./offre-detail.component.css']
})
export class OffreDetailComponent implements OnInit {
  offre: any = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  filiale: any = null;
  recruiterName: string = 'Chargement...';
  private toastActive: boolean = false;

  // Enum mappings supporting both string and numeric values
  typeContratLabels: { [key: string]: string } = {
    'CDI': 'CDI',
    'CDD': 'CDD',
    'Freelance': 'Freelance',
    'Stage': 'Stage',
    '1': 'CDI',
    '2': 'CDD',
    '3': 'Freelance',
    '4': 'Stage'
  };

  modeTravailLabels: { [key: string]: string } = {
    'Presentiel': 'Présentiel',
    'Hybride': 'Hybride',
    'Teletravail': 'Télétravail',
    '1': 'Présentiel',
    '2': 'Hybride',
    '3': 'Télétravail'
  };

  statutLabels: { [key: string]: string } = {
    'Ouverte': 'Ouverte',
    'Fermee': 'Fermée',
    'EnAttente': 'En attente',
    '1': 'Ouverte',
    '2': 'Fermée',
    '3': 'En attente'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Offer ID from route:', id);
    if (id && this.isValidGuid(id)) {
      this.loadOffre(id);
    } else {
      this.setError('ID de l\'offre invalide.');
      this.loading = false;
    }
  }

  private isValidGuid(value: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
  }

  private setError(message: string): void {
    console.log('Setting errorMessage:', message);
    this.errorMessage = message;
    if (!this.toastActive) {
      this.showErrorToast(message);
    }
  }

  loadOffre(id: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.offreService.getOffreEmploi(id).subscribe({
      next: (response) => {
        console.log('Réponse brute getOffreEmploi:', JSON.stringify(response, null, 2));
        if (response?.idOffreEmploi) {
          this.offre = response;
          
          // Normalisation des valeurs pour assurer la compatibilité avec les mappings
          if (this.offre.typeContrat !== undefined) {
            this.offre.typeContrat = String(this.offre.typeContrat);
          }
          if (this.offre.statut !== undefined) {
            this.offre.statut = String(this.offre.statut);
          }
          if (this.offre.modeTravail !== undefined) {
            this.offre.modeTravail = String(this.offre.modeTravail);
          }
          
          // Correction pour le nombre de postes
          if (this.offre.nombrePostes === 2147483647) {
            this.offre.nombrePostes = null;
          }
          
          console.log('Offre normalisée:', this.offre);

          // Fetch Filiale and Recruiter
          const requests: Observable<any>[] = [
            this.filialeService.getFiliale(this.offre.idFiliale).pipe(
              catchError((error) => {
                console.warn('Erreur récupération filiale:', error);
                this.setError('Impossible de charger les détails de la filiale.');
                return of(null);
              })
            ),
            this.userService.getUserById(this.offre.idRecruteur).pipe(
              catchError((error) => {
                console.warn('Erreur récupération recruteur:', error);
                this.setError('Impossible de charger les détails du recruteur.');
                return of({ fullName: 'Non spécifié' });
              })
            )
          ];

          rxjsForkJoin(requests).subscribe({
            next: ([filialeResponse, recruiterResponse]) => {
              console.log('Filiale brute:', filialeResponse);
              console.log('Recruteur:', recruiterResponse);
              
              // Traitement adaptatif de la réponse filiale
              if (filialeResponse) {
                if (filialeResponse.data) {
                  this.filiale = filialeResponse.data;
                } else if (filialeResponse.filiale) {
                  this.filiale = filialeResponse.filiale;
                } else {
                  this.filiale = filialeResponse;
                }
              } else {
                this.filiale = { nom: 'Non spécifié', adresse: 'Non spécifié' };
              }
              
              console.log('Filiale traitée:', this.filiale);
              
              this.recruiterName = recruiterResponse?.fullName || 'Non spécifié';
              this.loading = false;
            },
            error: (error) => {
              this.setError('Erreur lors du chargement des détails supplémentaires.');
              this.loading = false;
              console.error('Erreur forkJoin:', error);
            }
          });
        } else {
          this.setError('Offre non trouvée ou réponse vide.');
          this.loading = false;
          // Redirect to list if offer not found
          setTimeout(() => {
            this.router.navigate(['/offres']);
          }, 3000);
        }
      },
      error: (error) => {
        const errorMsg = error.message || 'Erreur lors du chargement de l\'offre (introuvable ou serveur indisponible).';
        this.setError(errorMsg);
        this.loading = false;
        console.error('Erreur chargement offre:', JSON.stringify(error, null, 2));
        // Redirect to list on error
        setTimeout(() => {
          this.router.navigate(['/offres']);
        }, 3000);
      }
    });
  }

  editOffre(): void {
    if (this.offre) {
      this.router.navigate(['/offre-emploi/edit', this.offre.idOffreEmploi]);
    } else {
      this.setError('Aucune offre sélectionnée pour modification.');
    }
  }

  deleteOffre(): void {
    if (this.offre) {
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment supprimer cette offre ? Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        position: 'center',
        width: '500px',
        customClass: {
          popup: 'swal-large'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.offreService.deleteOffre(this.offre.idOffreEmploi).subscribe({
            next: () => {
              this.showSuccessToast('Offre supprimée avec succès.');
              this.router.navigate(['/offres']);
            },
            error: (error) => {
              const errorMsg = error.message || 'Erreur lors de la suppression de l\'offre.';
              this.setError(errorMsg);
              console.error('Erreur suppression offre:', error);
            }
          });
        }
      });
    } else {
      this.setError('Aucune offre sélectionnée pour suppression.');
    }
  }

  showSuccessToast(message: string): void {
    this.toastActive = true;
    Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: message,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      width: '500px',
      customClass: {
        popup: 'swal-large'
      }
    }).then(() => {
      this.toastActive = false;
    });
  }

  showErrorToast(message: string): void {
    if (this.toastActive) return;
    this.toastActive = true;
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      width: '500px',
      customClass: {
        popup: 'swal-large'
      }
    }).then(() => {
      this.toastActive = false;
    });
  }
}
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { UserService } from '../../shared/services/user.service';
// import { catchError, Observable, of, forkJoin as rxjsForkJoin } from 'rxjs';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-offre-detail',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './offre-detail.component.html',
//   styleUrls: ['./offre-detail.component.css']
// })
// export class OffreDetailComponent implements OnInit {
//   offre: any = null;
//   loading: boolean = true;
//   errorMessage: string | null = null;
//   filiale: any = null;
//   recruiterName: string = 'Chargement...';
//   private toastActive: boolean = false;

//   // Enum mappings supporting both string and numeric values
//   typeContratLabels: { [key: string]: string } = {
//     'CDI': 'CDI',
//     'CDD': 'CDD',
//     'Freelance': 'Freelance',
//     'Stage': 'Stage',
//     '1': 'CDI',
//     '2': 'CDD',
//     '3': 'Freelance',
//     '4': 'Stage',
//     '0': 'Valeur invalide' // Handle invalid value
//   };

//   modeTravailLabels: { [key: string]: string } = {
//     'Presentiel': 'Présentiel',
//     'Hybride': 'Hybride',
//     'Teletravail': 'Télétravail',
//     '1': 'Présentiel',
//     '2': 'Hybride',
//     '3': 'Télétravail'
//   };

//   statutLabels: { [key: string]: string } = {
//     'Ouverte': 'Ouverte',
//     'Ouvert': 'Ouverte', // Handle backend value "Ouvert"
//     'Fermee': 'Fermée',
//     'EnAttente': 'En attente',
//     '1': 'Ouverte',
//     '2': 'Fermée',
//     '3': 'En attente'
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private userService: UserService
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     console.log('Offer ID from route:', id);
//     if (id && this.isValidGuid(id)) {
//       this.loadOffre(id);
//     } else {
//       this.setError('ID de l\'offre invalide.');
//       this.loading = false;
//     }
//   }

//   private isValidGuid(value: string): boolean {
//     const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//     return guidRegex.test(value);
//   }

//   private setError(message: string): void {
//     console.log('Setting errorMessage:', message);
//     this.errorMessage = message;
//     if (!this.toastActive) {
//       this.showErrorToast(message);
//     }
//   }

//   loadOffre(id: string): void {
//     this.loading = true;
//     this.errorMessage = null;
//     this.offreService.getOffreEmploi(id).subscribe({
//       next: (response) => {
//         console.log('Réponse brute getOffreEmploi:', JSON.stringify(response, null, 2));
//         if (response?.idOffreEmploi) {
//           this.offre = response.idOffreEmploi || response;
          
//           // Normalisation des valeurs pour assurer la compatibilité avec les mappings
//           if (this.offre.typeContrat !== undefined) {
//             this.offre.typeContrat = String(this.offre.typeContrat);
//             if (this.offre.typeContrat === '0') {
//               console.warn('Type de contrat invalide détecté:', this.offre.typeContrat);
//               this.showWarningToast('Type de contrat invalide détecté. Veuillez modifier l\'offre pour corriger.');
//             }
//           }
//           if (this.offre.statut !== undefined) {
//             this.offre.statut = String(this.offre.statut);
//           }
//           if (this.offre.modeTravail !== undefined) {
//             this.offre.modeTravail = String(this.offre.modeTravail);
//           }
          
//           // Correction pour le nombre de postes
//           if (this.offre.nombrePostes === 2147483647) {
//             this.offre.nombrePostes = null;
//           }
          
//           console.log('Offre normalisée:', this.offre);

//           // Fetch Filiale and Recruiter
//           const requests: Observable<any>[] = [
//             this.filialeService.getFiliale(this.offre.idFiliale).pipe(
//               catchError((error) => {
//                 console.warn('Erreur récupération filiale:', error);
//                 this.setError('Impossible de charger les détails de la filiale.');
//                 return of(null);
//               })
//             ),
//             this.userService.getUserById(this.offre.idRecruteur).pipe(
//               catchError((error) => {
//                 console.warn('Erreur récupération recruteur:', error);
//                 this.setError('Impossible de charger les détails du recruteur.');
//                 return of({ fullName: 'Non spécifié' });
//               })
//             )
//           ];

//           rxjsForkJoin(requests).subscribe({
//             next: ([filialeResponse, recruiterResponse]) => {
//               console.log('Filiale brute:', filialeResponse);
//               console.log('Recruteur brut:', recruiterResponse);
              
//               // Traitement adaptatif de la réponse filiale
//               if (filialeResponse) {
//                 if (filialeResponse.data) {
//                   this.filiale = filialeResponse.data;
//                 } else if (filialeResponse.filiale) {
//                   this.filiale = filialeResponse.filiale;
//                 } else {
//                   this.filiale = filialeResponse;
//                 }
//               } else {
//                 this.filiale = { nom: 'Non spécifié', adresse: 'Non spécifié' };
//               }
              
//               console.log('Filiale traitée:', this.filiale);
              
//               // Vérifier la réponse du recruteur
//               if (recruiterResponse && recruiterResponse.fullName) {
//                 this.recruiterName = recruiterResponse.fullName;
//               } else {
//                 console.warn('Nom du recruteur non trouvé dans la réponse:', recruiterResponse);
//                 this.recruiterName = 'Non spécifié';
//                 this.showWarningToast('Nom du recruteur non disponible.');
//               }
              
//               this.loading = false;
//             },
//             error: (error) => {
//               this.setError('Erreur lors du chargement des détails supplémentaires.');
//               this.loading = false;
//               console.error('Erreur forkJoin:', error);
//             }
//           });
//         } else {
//           this.setError('Offre non trouvée ou réponse vide.');
//           this.loading = false;
//           setTimeout(() => {
//             this.router.navigate(['/offres']);
//           }, 3000);
//         }
//       },
//       error: (error) => {
//         const errorMsg = error.message || 'Erreur lors du chargement de l\'offre (introuvable ou serveur indisponible).';
//         this.setError(errorMsg);
//         this.loading = false;
//         console.error('Erreur chargement offre:', JSON.stringify(error, null, 2));
//         setTimeout(() => {
//           this.router.navigate(['/offres']);
//         }, 3000);
//       }
//     });
//   }

//   editOffre(): void {
//     if (this.offre) {
//       this.router.navigate(['/offre-emploi/edit', this.offre.idOffreEmploi]);
//     } else {
//       this.setError('Aucune offre sélectionnée pour modification.');
//     }
//   }

//   deleteOffre(): void {
//     if (this.offre) {
//       Swal.fire({
//         title: 'Êtes-vous sûr ?',
//         text: 'Voulez-vous vraiment supprimer cette offre ? Cette action est irréversible.',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Oui, supprimer',
//         cancelButtonText: 'Annuler',
//         position: 'center',
//         width: '500px',
//         customClass: {
//           popup: 'swal-large'
//         }
//       }).then((result) => {
//         if (result.isConfirmed) {
//           this.offreService.deleteOffre(this.offre.idOffreEmploi).subscribe({
//             next: () => {
//               this.showSuccessToast('Offre supprimée avec succès.');
//               this.router.navigate(['/offres']);
//             },
//             error: (error) => {
//               const errorMsg = error.message || 'Erreur lors de la suppression de l\'offre.';
//               this.setError(errorMsg);
//               console.error('Erreur suppression offre:', error);
//             }
//           });
//         }
//       });
//     } else {
//       this.setError('Aucune offre sélectionnée pour suppression.');
//     }
//   }

//   showSuccessToast(message: string): void {
//     this.toastActive = true;
//     Swal.fire({
//       icon: 'success',
//       title: 'Succès!',
//       text: message,
//       position: 'center',
//       showConfirmButton: false,
//       timer: 3000,
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
//     }).then(() => {
//       this.toastActive = false;
//     });
//   }

//   showErrorToast(message: string): void {
//     if (this.toastActive) return;
//     this.toastActive = true;
//     Swal.fire({
//       icon: 'error',
//       title: 'Erreur',
//       text: message,
//       position: 'center',
//       showConfirmButton: false,
//       timer: 3000,
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
//     }).then(() => {
//       this.toastActive = false;
//     });
//   }

//   showWarningToast(message: string): void {
//     if (this.toastActive) return;
//     this.toastActive = true;
//     Swal.fire({
//       icon: 'warning',
//       title: 'Attention',
//       text: message,
//       position: 'center',
//       showConfirmButton: false,
//       timer: 3000,
//       width: '500px',
//       customClass: {
//         popup: 'swal-large'
//       }
//     }).then(() => {
//       this.toastActive = false;
//     });
//   }
// }

