// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../../shared/services/filiale.service';
// import { OffreMissionService } from '../../../shared/services/offre-mission.service';
// import { LangueService } from '../../../shared/services/langue.service';
// import { AuthService } from '../../../shared/services/auth.service';
// import { 
//   ModeTravail, 
//   StatutOffre, 
//   TypeContratEnum, 
//   NiveauRequisType 
// } from '../../../Models/enums.model';
// import { 
//   OffreEmploi, 
//   OffreLangue, 
//   OffreMission,
//   Poste
// } from '../../../Models/offre-emploi.model';
// import { OffreCompetence } from '../../../Models/offre-competence.model';
// import { OffreCompetenceService } from '../../../shared/services/offre-competence.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-job-details',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './job-details.component.html',
//   styleUrls: ['./job-details.component.css']
// })
// export class JobDetailsComponent implements OnInit {
//   offre: OffreEmploi = {
//     postes: [{ 
//       titrePoste: '', 
//       description: '', 
//       nombrePostes: 0, 
//       niveauHierarchique: '' 
//     }],
//     salaireMin: 0,
//     salaireMax: 0,
//     typeContrat: TypeContratEnum.CDI,
//     statut: StatutOffre.Ouvert,
//     specialite: '',
//     dateExpiration: new Date().toISOString(),
//     niveauExperienceRequis: '',
//     modeTravail: ModeTravail.Presentiel,
//     avantages: '',
//     estActif: true,
//     idRecruteur: '',
//     idFiliale: '',
//     idDepartement: '',
//     offreMissions: [],
//     offreLangues: [],
//     offreCompetences: [],
//     diplomeIds: [],
//     datePublication: new Date().toISOString(),
//     diplomes: []
//   };
  
//   filiale: any = {};
//   idOffreEmploi: string | null = null;
//   missions: OffreMission[] = [];
//   langues: OffreLangue[] = [];
//   competences: OffreCompetence[] = [];
//   loading = true;
//   error: string | null = null;

//   // Couleurs pour les types de contrat
//   CONTRACT_COLORS = {
//     [TypeContratEnum.CDI]: '#28a745',
//     [TypeContratEnum.CDD]: '#007bff',
//     [TypeContratEnum.Freelance]: '#ffc107',
//     [TypeContratEnum.Stage]: '#dc3545',
//     [TypeContratEnum.Alternance]: '#17a2b8',
//     default: '#6c757d'
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private missionService: OffreMissionService,
//     private langueService: LangueService,
//     private competenceService: OffreCompetenceService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe({
//       next: params => {
//         this.idOffreEmploi = params.get('id');
//         if (this.idOffreEmploi) {
//           this.loadJobDetails(this.idOffreEmploi);
//         } else {
//           this.handleError('Aucun ID d\'offre spécifié');
//         }
//       },
//       error: err => this.handleError(err.message)
//     });
//   }

//   private loadJobDetails(id: string): void {
//     this.offreService.getById(id).subscribe({
//       next: (response) => {
//         this.offre = this.sanitizeOffre(response);
//         if (this.offre.idFiliale) {
//           this.loadFilialeDetails(this.offre.idFiliale);
//           this.loadMissions(id);
//           this.loadLangues(id);
//           this.loadCompetences(id);
//         }
//         this.loading = false;
//       },
//       error: (err) => this.handleError(err.message)
//     });
//   }

//   private sanitizeOffre(offre: any): OffreEmploi {
//     return {
//       ...offre,
//       postes: offre.postes?.length ? offre.postes : [{ description: 'Non spécifié' }],
//       salaireMin: offre.salaireMin || 0,
//       salaireMax: offre.salaireMax || 0,
//       typeContrat: offre.typeContrat || TypeContratEnum.CDD,
//       statut: offre.statut || StatutOffre.Ouvert
//     };
//   }

//   private loadFilialeDetails(idFiliale: string): void {
//     this.filialeService.getFiliale(idFiliale).subscribe({
//       next: (response) => {
//         this.filiale = {
//           ...response,
//           nom: response.nom ?? 'Nom inconnu',
//           adresse: response.adresse ?? 'Adresse non disponible',
//         };
//       },
//       error: (err) => console.error('Erreur filiale:', err)
//     });
//   }

//   private loadMissions(idOffre: string): void {
//     this.missionService.getByOffreEmploi(idOffre).subscribe({
//       next: (missions) => {
//         this.missions = missions.map(mission => ({
//           ...mission,
//           descriptionMission: mission.descriptionMission || 'Mission non décrite'
//         }));
//       },
//       error: (err) => console.error('Erreur missions:', err)
//     });
//   }

//   private loadLangues(idOffre: string): void {
//     this.langueService.getByOffreId(idOffre).subscribe({
//       next: (langues) => {
//         this.langues = langues.map(langue => ({
//           ...langue,
//           nomLangue: langue.langue || 'Langue non spécifiée',
//           niveau: langue.niveauRequis || 'Niveau non précisé'
//         }));
//       },
//       error: (err) => console.error('Erreur langues:', err)
//     });
//   }

//   private loadCompetences(idOffre: string): void {
//     this.competenceService.getByOffreId(idOffre).subscribe({
//       next: (competences) => {
//         this.competences = competences.map(competence => ({
//           ...competence,
//           nomCompetence: competence.competence?.nom || 'Compétence générique',
//           niveauRequis: competence.niveauRequis || 'Non spécifié'
//         }));
//       },
//       error: (err) => console.error('Erreur compétences:', err)
//     });
//   }

//   // Helpers
//   formatDate(date?: Date | string): string {
//     if (!date) return 'Non spécifié';
//     try {
//       return new Date(date).toLocaleDateString('fr-FR', { 
//         day: '2-digit', 
//         month: 'long', 
//         year: 'numeric' 
//       });
//     } catch {
//       return 'Date invalide';
//     }
//   }

//   getTypeContratLabel(type?: TypeContratEnum): string {
//     if (!type) return 'Non spécifié';
//     switch(type) {
//       case TypeContratEnum.CDI: return 'CDI';
//       case TypeContratEnum.CDD: return 'CDD';
//       case TypeContratEnum.Freelance: return 'Freelance';
//       case TypeContratEnum.Stage: return 'Stage';
//       case TypeContratEnum.Alternance: return 'Alternance';
//       default: return 'Autre';
//     }
//   }

// getModeTravailLabel(mode: ModeTravail | undefined): string {
//   if (mode === undefined) return 'Non spécifié';
//   switch(mode) {
//     case ModeTravail.Presentiel: return 'Présentiel';
//     case ModeTravail.Hybride: return 'Hybride';
//     case ModeTravail.Teletravail: return 'Télétravail';
//     default: 
//       // You can either return a default value or throw an error
//       // depending on your application's requirements
//       return 'Unknown mode';
//   }
// }

//   get statutOuvert(): boolean {
//     return this.offre?.statut === StatutOffre.Ouvert;
//   }
  
//   getContractColor(type?: TypeContratEnum): string {
//     return type ? this.CONTRACT_COLORS[type] || this.CONTRACT_COLORS.default : this.CONTRACT_COLORS.default;
//   }

//   getSkillLevelWidth(niveau?: string): string {
//     const LEVELS: Record<string, string> = {
//       'débutant': '25%',
//       'intermédiaire': '50%',
//       'avancé': '75%',
//       'expert': '100%'
//     };
//     return niveau ? LEVELS[niveau.toLowerCase()] || '50%' : '0%';
//   }

// getStatutOffreLabel(statut?: StatutOffre): string {
//   return statut === StatutOffre.Ouvert ? 'Ouverte' : 'colture';
// }

//   getStatutOffreColor(statut?: StatutOffre): string {
//     return statut === StatutOffre.Ouvert ? '#28a745' : '#dc3545';
//   }

//   navigateToCandidature(): void {
//     if (this.idOffreEmploi) {
//       this.router.navigate(['/candidature', this.idOffreEmploi, 'postuler']);
//     }
//   }

//   onLogout(): void {
//     this.authService.deleteToken();
//     this.router.navigateByUrl('/signin');
//   }

//   private handleError(message: string): void {
//     this.error = message;
//     this.loading = false;
//     setTimeout(() => this.router.navigate(['/offres']), 3000);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { FilialeService } from '../../../shared/services/filiale.service';
import { OffreMissionService } from '../../../shared/services/offre-mission.service';
import { LangueService } from '../../../shared/services/langue.service';
import { AuthService } from '../../../shared/services/auth.service';
import { 
  ModeTravail, 
  StatutOffre, 
  TypeContratEnum, 
  NiveauRequisType 
} from '../../../Models/enums.model';
import { 
  OffreEmploi, 
  OffreLangue, 
  OffreMission,
  Poste
} from '../../../Models/offre-emploi.model';
import { OffreCompetence } from '../../../Models/offre-competence.model';
import { OffreCompetenceService } from '../../../shared/services/offre-competence.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  offre: OffreEmploi = {
    postes: [{ 
      titrePoste: '', 
      description: '', 
      nombrePostes: 0, 
      niveauHierarchique: '' 
    }],
    salaireMin: 0,
    salaireMax: 0,
    typeContrat: TypeContratEnum.CDI,
    statut: StatutOffre.Ouvert,
    specialite: '',
    dateExpiration: new Date().toISOString(),
    niveauExperienceRequis: '',
    modeTravail: ModeTravail.Presentiel,
    avantages: '',
    estActif: true,
    idRecruteur: '',
    idFiliale: '',
    idDepartement: '',
    offreMissions: [],
    offreLangues: [],
    offreCompetences: [],
    diplomeIds: [],
    datePublication: new Date().toISOString(),
    diplomes: []
  };
someIdCompetence: string = '';

  filiale: any = {};
  idOffreEmploi: string | null = null;
  missions: OffreMission[] = [];
  langues: OffreLangue[] = [];
  competences: OffreCompetence[] = [];
  loading = true;
  error: string | null = null;

  CONTRACT_COLORS = {
    [TypeContratEnum.CDI]: '#28a745',
    [TypeContratEnum.CDD]: '#007bff',
    [TypeContratEnum.Freelance]: '#ffc107',
    [TypeContratEnum.Stage]: '#dc3545',
    [TypeContratEnum.Alternance]: '#17a2b8',
    default: '#6c757d'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private missionService: OffreMissionService,
    private langueService: LangueService,
    private competenceService: OffreCompetenceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: params => {
        this.idOffreEmploi = params.get('id');
        if (this.idOffreEmploi) {
          this.loadJobDetails(this.idOffreEmploi);
        } else {
          this.handleError('Aucun ID d\'offre spécifié');
        }
      },
      error: err => this.handleError(err.message)
    });
  }

  private loadJobDetails(id: string): void {
    this.offreService.getById(id).subscribe({
      next: (response) => {
        this.offre = this.sanitizeOffre(response);
        if (this.offre.idFiliale) {
          this.loadFilialeDetails(this.offre.idFiliale);
          this.loadMissions(id);
          this.loadLangues(id);
this.loadCompetences(id, this.someIdCompetence);        }
        this.loading = false;
      },
      error: (err) => this.handleError(err.message)
    });
  }

  private sanitizeOffre(offre: any): OffreEmploi {
    return {
      ...offre,
      postes: offre.postes?.length ? offre.postes : [{ description: 'Non spécifié' }],
      salaireMin: offre.salaireMin || 0,
      salaireMax: offre.salaireMax || 0,
      typeContrat: offre.typeContrat || TypeContratEnum.CDD,
      statut: offre.statut || StatutOffre.Ouvert
    };
  }

  private loadFilialeDetails(idFiliale: string): void {
    this.filialeService.getFiliale(idFiliale).subscribe({
      next: (response) => {
        this.filiale = {
          ...response,
          nom: response.nom ?? 'Nom inconnu',
          adresse: response.adresse ?? 'Adresse non disponible',
        };
      },
      error: (err) => console.error('Erreur filiale:', err)
    });
  }

  private loadMissions(idOffre: string): void {
  this.missionService.getById(idOffre).subscribe({
/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Sets the list of missions for the job offer.
     * If a mission has no description, sets a default description.
     * @param missions The list of missions to set.
     */
/*******  be547b50-49f4-407b-b0f6-9d0fa67520f5  *******/
    next: (missions: OffreMission[]) => {
      this.missions = missions.map(mission => ({
        ...mission,
        descriptionMission: mission.descriptionMission || 'Mission non décrite'
      }));
    },
    error: (err) => console.error('Erreur missions:', err)
  });
}

 private loadLangues(idOffre: string): void {
  this.langueService.getById(idOffre).subscribe({
    next: (langue) => {
      this.langues.push({
        ...langue,
        langue: langue.langue || 'Langue non spécifiée',
        niveauRequis: langue.niveauRequis || 'Niveau non précisé'
      });
    },
    error: (err) => console.error('Erreur langues:', err)
  });
}

private loadCompetences(idOffre: string, idCompetence: string): void {

this.competenceService.getById(idOffre, idCompetence).subscribe({
    next: (competence: OffreCompetence) => {
      this.competences = [competence].map(competence => ({
        ...competence,
        competence: competence.competence || {
          nom: 'Compétence générique',
          description: '',
          hardSkills: false, // Assign a default boolean value
          estTechnique: false,
          estSoftSkill: false
        },
        niveauRequis: competence.niveauRequis || 'Non spécifié'
      }));
    },
    error: (err) => console.error('Erreur compétences:', err)
  });
}
  formatDate(date?: Date | string): string {
    if (!date) return 'Non spécifié';
    try {
      return new Date(date).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return 'Date invalide';
    }
  }

  getModeTravailLabel(mode: ModeTravail | undefined): string {
    if (mode === undefined) return 'Non spécifié';
    switch(mode) {
      case ModeTravail.Presentiel: return 'Présentiel';
      case ModeTravail.Hybride: return 'Hybride';
      case ModeTravail.Teletravail: return 'Télétravail';
      default: return 'Mode inconnu';
    }
  }

  getSkillLevelWidth(niveau?: string): string {
    const LEVELS: Record<string, string> = {
      'débutant': '25%',
      'intermédiaire': '50%',
      'avancé': '75%',
      'expert': '100%'
    };
    return niveau ? LEVELS[niveau.toLowerCase()] || '50%' : '0%';
  }

  getStatutOffreLabel(statut?: StatutOffre): string {
    return statut === StatutOffre.Ouvert ? 'Ouverte' : 'Fermée';
  }

  getStatutOffreColor(statut?: StatutOffre): string {
    return statut === StatutOffre.Ouvert ? '#28a745' : '#dc3545';
  }

  navigateToCandidature(): void {
    if (this.idOffreEmploi) {
      this.router.navigate(['/candidature', this.idOffreEmploi, 'postuler']);
    }
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    setTimeout(() => this.router.navigate(['/offres']), 3000);
  }
}