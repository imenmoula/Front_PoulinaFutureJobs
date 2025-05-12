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
import { OffreEmploi, Diplome } from '../../Models/offre-emploi.model';
import { Filiale } from '../../Models/filiale.model';
import { AppUser } from '../../Models/Candidature.model';
import { NiveauRequisType } from '../../Models/enums.model';

@Component({
  selector: 'app-offre-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offre-detail.component.html',
  styleUrls: ['./offre-detail.component.css']
})
export class OffreDetailComponent implements OnInit {
  offre: OffreEmploi | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  filiale: Filiale | null = null;
  recruiterName: string = 'Chargement...';
  diplomes: Diplome[] = [];
  userRole: string = '';
  private toastActive: boolean = false;

  // Map NiveauRequisType enum values to display labels
  niveauRequisLabels: { [key in NiveauRequisType]: string } = {
    [NiveauRequisType.Debutant]: 'Débutant',
    [NiveauRequisType.Intermediaire]: 'Intermédiaire',
    [NiveauRequisType.Avance]: 'Avancé',
    [NiveauRequisType.Expert]: 'Expert'
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
    this.errorMessage = message;
    if (!this.toastActive) {
      this.showErrorToast(message);
    }
  }

  loadOffre(id: string): void {
    this.loading = true;
    this.errorMessage = null;

    this.offreService.getById(id).subscribe({
      next: (offre) => {
        if (offre?.idOffreEmploi) {
          this.offre = offre;

          // Initialize arrays to prevent undefined errors
          this.offre.offreMissions = this.offre.offreMissions || [];
          this.offre.offreLangues = this.offre.offreLangues || [];
          this.offre.offreCompetences = this.offre.offreCompetences || [];
          this.offre.postes = this.offre.postes || [];
          this.offre.diplomeIds = this.offre.diplomeIds || [];

          // Normalize niveauRequis for competencies and languages
          this.offre.offreCompetences = this.offre.offreCompetences.map(oc => ({
            ...oc,
            niveauRequis: this.normalizeNiveauRequis(oc.niveauRequis)
          }));
          this.offre.offreLangues = this.offre.offreLangues.map(langue => ({
            ...langue,
            niveauRequis: this.normalizeNiveauRequis(langue.niveauRequis)
          }));

          if (!this.offre.idFiliale || !this.offre.idRecruteur) {
            this.setError('ID de la filiale ou du recruteur manquant.');
            this.loading = false;
            return;
          }

          const requests: Observable<any>[] = [
            this.filialeService.getFiliale(this.offre.idFiliale).pipe(
              catchError(() => {
                this.setError('Impossible de charger les détails de la filiale.');
                return of(null);
              })
            ),
            this.userService.getUserById(this.offre.idRecruteur).pipe(
              catchError(() => {
                this.setError('Impossible de charger les détails du recruteur.');
                return of({ fullName: 'Non spécifié' } as AppUser);
              })
            )
          ];

          if (this.offre.diplomeIds.length > 0) {
            const diplomeRequests = this.offre.diplomeIds.map(id =>
              this.diplomeService.getById(id).pipe(
                catchError(() => {
                  return of({ idDiplome: id, nomDiplome: 'Non spécifié', niveau: '', domaine: '', institution: '' } as Diplome);
                })
              )
            );
            requests.push(...diplomeRequests);
          }

          forkJoin(requests).subscribe({
            next: (results) => {
              const [filiale, recruiter, ...diplomes] = results;
              this.filiale = filiale || { nom: 'Non spécifié', adresse: 'Non spécifié' };
              this.recruiterName = recruiter?.fullName || 'Non spécifié';
              this.diplomes = diplomes.filter(d => d && d.idDiplome) || [];
              this.loading = false;
            },
            error: () => {
              this.setError('Erreur lors du chargement des détails supplémentaires.');
              this.loading = false;
            }
          });
        } else {
          this.setError('Offre non trouvée.');
          this.loading = false;
          setTimeout(() => this.router.navigate(['/offres']), 3000);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement de l\'offre.');
        this.loading = false;
        setTimeout(() => this.router.navigate(['/offres']), 3000);
      }
    });
  }

  private normalizeNiveauRequis(niveau: string): NiveauRequisType {
    if (!niveau) return NiveauRequisType.Debutant; // Default to Debutant if undefined
    const normalized = niveau.charAt(0).toUpperCase() + niveau.slice(1).toLowerCase();
    return Object.values(NiveauRequisType).includes(normalized as NiveauRequisType)
      ? (normalized as NiveauRequisType)
      : NiveauRequisType.Debutant;
  }

  applyForOffre(): void {
    if (this.offre) {
      Swal.fire({
        icon: 'info',
        title: 'Postuler',
        text: 'Fonctionnalité de candidature en cours de développement.',
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
    } else {
      this.setError('Aucune offre sélectionnée pour postuler.');
    }
  }

  editOffre(): void {
    if (this.offre) {
      this.router.navigate(['/offres/update', this.offre.idOffreEmploi]);
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
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.offreService.deleteOffre(this.offre!.idOffreEmploi!).subscribe({
            next: () => {
              this.showSuccessToast('Offre supprimée avec succès.');
              this.router.navigate(['/offres']);
            },
            error: (error) => {
              this.setError(error.message || 'Erreur lors de la suppression de l\'offre.');
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
      showConfirmButton: false,
      timer: 3000
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
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.toastActive = false;
    });
  }
}
