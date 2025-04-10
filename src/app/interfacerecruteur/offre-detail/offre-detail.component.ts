import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModeTravail, StatutOffre, TypeContratEnum } from '../../Models/enums.model';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { CompetenceService } from '../../shared/services/competence.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { UserService } from '../../shared/services/user.service';
import { Observable, forkJoin as rxjsForkJoin } from 'rxjs';

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

  // Enum mappings for display
  typeContratLabels: { [key: number]: string } = {
    [TypeContratEnum.CDI]: 'CDI',
    [TypeContratEnum.CDD]: 'CDD',
    [TypeContratEnum.Freelance]: 'Freelance',
    [TypeContratEnum.Stage]: 'Stage'
  };

  modeTravailLabels: { [key: number]: string } = {
    [ModeTravail.Presentiel]: 'Présentiel',
    [ModeTravail.Hybride]: 'Hybride',
    [ModeTravail.Teletravail]: 'Télétravail'
  };

  statutLabels: { [key: number]: string } = {
    [StatutOffre.Ouvert]: 'Ouverte',
    [StatutOffre.Ferme]: 'Fermée'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private competenceService: CompetenceService,
    private filialeService: FilialeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOffre(id);
    }
  }

  loadOffre(id: string): void {
    this.loading = true;
    this.offreService.getOffreEmploi(id).subscribe({
      next: (response) => {
        this.offre = response.offreEmploi;

        // Fetch Filiale and Recruiter
        const requests = [
          this.filialeService.getFiliale(this.offre.idFiliale),
          this.userService.getUserById(this.offre.idRecruteur)
        ];

        // Competences are already included in the response, no need to fetch separately
        forkJoin(requests).subscribe({
          next: ([filialeResponse, recruiterResponse]) => {
            this.filiale = filialeResponse;
            this.recruiterName = recruiterResponse.fullName || 'Inconnu';
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors du chargement des détails supplémentaires.';
            this.loading = false;
            console.error('Error loading additional details:', error);
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'offre.';
        this.loading = false;
        console.error('Error loading offer:', error);
      }
    });
  }

  editOffre(): void {
    if (this.offre) {
      this.router.navigate(['/offre-emploi/edit', this.offre.idOffreEmploi]);
    }
  }

  deleteOffre(): void {
    if (this.offre && confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.offreService.deleteOffre(this.offre.idOffreEmploi).subscribe({
        next: () => {
          this.router.navigate(['/offre-emplois']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'offre.';
          console.error('Error deleting offer:', error);
        }
      });
    }
  }
}

function forkJoin(requests: Observable<any>[]): Observable<any[]> {
  return rxjsForkJoin(requests);
}



