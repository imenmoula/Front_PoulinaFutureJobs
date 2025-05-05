import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { UserService } from '../../shared/services/user.service';
import { DiplomeService } from '../../shared/services/diplome.service';
import { AuthService } from '../../shared/services/auth.service';
import { catchError, Observable, of, forkJoin } from 'rxjs';
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
  diplomes: any[] = [];
  userRole: string = '';
  private toastActive: boolean = false;

  niveauRequisLabels: { [key: string]: string } = {
    'Debutant': 'Débutant',
    'Intermediaire': 'Intermédiaire',
    'Avance': 'Avancé',
    'Expert': 'Expert'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private userService: UserService,
    private diplomeService: DiplomeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRoles()[0] || '';
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
    this.offreService.getById(id).subscribe({
      next: (response) => {
        console.log('Réponse brute getOffreEmploi:', JSON.stringify(response, null, 2));
        const offreData = response?.offreEmploi || response;
                        if (offreData?.idOffreEmploi) {
          this.offre = offreData;

          if (this.offre.nombrePostes === 2147483647) {
            this.offre.nombrePostes = null;
          }

          // Initialize arrays
          this.offre.offreMissions = this.offre.offreMissions || [];
          this.offre.offreLangues = this.offre.offreLangues || [];
          this.offre.offreCompetences = this.offre.offreCompetences || [];
          this.offre.postes = this.offre.postes || [];
          this.offre.diplomeIds = this.offre.diplomeIds || [];

          console.log('Offre normalisée:', this.offre);

          if (!this.offre.idFiliale || !this.offre.idRecruteur) {
            this.setError('ID de la filiale ou du recruteur manquant.');
            this.loading = false;
            return;
          }

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

          if (this.offre.diplomeIds.length > 0) {
            const diplomeRequests = this.offre.diplomeIds.map((id: string) =>
              this.diplomeService.getById(id).pipe(
                catchError((error) => {
                  console.warn(`Erreur récupération diplôme ${id}:`, error);
                  return of({ idDiplome: id, nomDiplome: 'Non spécifié', niveau: '', domaine: '', institution: '' });
                })
              )
            );
            requests.push(...diplomeRequests);
          }

          forkJoin(requests).subscribe({
            next: (results) => {
              const [filialeResponse, recruiterResponse, ...diplomeResponses] = results;
              console.log('Filiale brute:', filialeResponse);
              console.log('Recruteur brut:', recruiterResponse);
              console.log('Diplômes bruts:', diplomeResponses);

              if (filialeResponse) {
                this.filiale = filialeResponse.data || filialeResponse.filiale || filialeResponse;
              } else {
                this.filiale = { nom: 'Non spécifié', adresse: 'Non spécifié' };
              }

              this.recruiterName = recruiterResponse?.fullName || 'Non spécifié';
              this.diplomes = diplomeResponses || [];
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
          setTimeout(() => {
            this.router.navigate(['/offres']);
          }, 3000);
        }
      },
      error: (error) => {
        const errorMsg = error.message || 'Erreur lors du chargement de l\'offre.';
        this.setError(errorMsg);
        this.loading = false;
        console.error('Erreur chargement offre:', JSON.stringify(error, null, 2));
        setTimeout(() => {
          this.router.navigate(['/offres']);
        }, 3000);
      }
    });
  }

  applyForOffre(): void {
    if (this.offre) {
      Swal.fire({
        icon: 'info',
        title: 'Postuler',
        text: 'Fonctionnalité de candidature en cours de développement.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: { popup: 'swal-large' }
      });
    } else {
      this.setError('Aucune offre sélectionnée pour postuler.');
    }
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
        customClass: { popup: 'swal-large' }
      }).then((result) => {
        if (result.isConfirmed) {
          this.offreService.delete(this.offre.idOffreEmploi).subscribe({
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
      customClass: { popup: 'swal-large' }
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
      customClass: { popup: 'swal-large' }
    }).then(() => {
      this.toastActive = false;
    });
  }

  showWarningToast(message: string): void {
    if (this.toastActive) return;
    this.toastActive = true;
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: message,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      width: '500px',
      customClass: { popup: 'swal-large' }
    }).then(() => {
      this.toastActive = false;
    });
  }
}