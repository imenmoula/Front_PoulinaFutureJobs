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
import { DiplomeService } from '../../../shared/services/diplome.service';
import { PosteService } from '../../../shared/services/poste.service';

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
  
  filiale: any = {};
  idOffreEmploi: string | null = null;
  missions: OffreMission[] = [];
  langues: OffreLangue[] = [];
  competences: OffreCompetence[] = [];
  postes: Poste[] = [];
  loading = true;
  error: string | null = null;
 StatutOffre = StatutOffre;
  currentYear: number = new Date().getFullYear();


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
    private diplomeService: DiplomeService,
    private posteService: PosteService,
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
        }
        this.loadMissions(id);
        this.loadLangues(id);
        this.loadCompetences(id);
        this.loadPostes(id);
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
    this.missionService.getByOffreId(idOffre).subscribe({
      next: (missions) => {
        this.missions = missions.map(mission => ({
          ...mission,
          descriptionMission: mission.descriptionMission || 'Mission non décrite'
        }));
      },
      error: (err) => console.error('Erreur missions:', err)
    });
  }

  private loadLangues(idOffre: string): void {
    this.langueService.getByOffreId(idOffre).subscribe({
      next: (langues) => {
        this.langues = langues.map(langue => ({
          ...langue,
          langue: langue.langue || 'Langue non spécifiée',
          niveauRequis: langue.niveauRequis || 'Niveau non précisé'
        }));
      },
      error: (err) => console.error('Erreur langues:', err)
    });
  }

  private loadCompetences(idOffre: string): void {
    this.competenceService.getByOffreId(idOffre).subscribe({
      next: (competences) => {
        this.competences = competences.map(competence => ({
          ...competence,
          competence: competence.competence || {
            nom: 'Compétence générique',
            description: '',
            hardSkills: false,
            estTechnique: false,
            estSoftSkill: false
          },
          niveauRequis: competence.niveauRequis || 'Non spécifié'
        }));
      },
      error: (err) => console.error('Erreur compétences:', err)
    });
  }

  private loadPostes(idOffre: string): void {
    this.posteService.getByOffreId(idOffre).subscribe({
      next: (postes) => {
        this.postes = postes;
      },
      error: (err) => console.error('Erreur postes:', err)
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
    return statut === StatutOffre.Ouvert ? 'Ouvert' : 'colture';
  }

  getStatutOffreColor(statut?: StatutOffre): string {
    return statut === StatutOffre.Ouvert ? '#28a745' : '#dc3545';
  }

  getSalaireDisplay(): string {
    if (!this.offre.salaireMin && !this.offre.salaireMax) return 'Non spécifié';
    if (this.offre.salaireMin && !this.offre.salaireMax) return `À partir de ${this.offre.salaireMin} €`;
    if (!this.offre.salaireMin && this.offre.salaireMax) return `Jusqu'à ${this.offre.salaireMax} €`;
    return `${this.offre.salaireMin} - ${this.offre.salaireMax} €`;
  }

 // Ajouter cette fonction pour toujours afficher le bouton
shouldShowApplyButton(): boolean {
  return true; // Toujours afficher le bouton
}

// Modifier la fonction navigateToCandidature
navigateToCandidature(): void {
  if (this.idOffreEmploi) {
    this.router.navigate(['/candidature', this.idOffreEmploi, 'postuler']);
  } else {
    console.error('ID offre manquant pour la candidature');
    // Optionnel: Afficher un message d'erreur à l'utilisateur
  }
}

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    setTimeout(() => this.router.navigate(['/offres']), 3000);
  }
}