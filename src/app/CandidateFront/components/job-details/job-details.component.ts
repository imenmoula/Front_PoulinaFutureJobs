import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { OffreEmploi } from '../../../Models/offre-emploi.model';
import { FilialeService } from '../../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModeTravail, StatutOffre, TypeContratEnum } from '../../../Models/enums.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: [
    './job-details.component.css',
    '../../../../assets/User/css/bootstrap.min.css',
    '../../../../assets/User/css/owl.carousel.min.css',
    '../../../../assets/User/css/flaticon.css',
    '../../../../assets/User/css/price_rangs.css',
    '../../../../assets/User/css/slicknav.css',
    '../../../../assets/User/css/animate.min.css',
    '../../../../assets/User/css/magnific-popup.css',
    '../../../../assets/User/css/fontawesome-all.min.css',
    '../../../../assets/User/css/themify-icons.css',
    '../../../../assets/User/css/slick.css',
    '../../../../assets/User/css/nice-select.css',
    '../../../../assets/User/css/style.css'
  ]
})
export class JobDetailsComponent implements OnInit {
  offre: OffreEmploi | null = null;
  filiale: Filiale | null = null;
  idOffreEmploi: string | null = null;
  loading: boolean = true;
  error: string | null = null;

  typeContratLabels = {
    [TypeContratEnum.CDI]: 'CDI',
    [TypeContratEnum.CDD]: 'CDD',
    [TypeContratEnum.Freelance]: 'Freelance',
    [TypeContratEnum.Stage]: 'Stage',
    [TypeContratEnum.Alternance]: 'Alternance'
  };

  modeTravailLabels = {
    [ModeTravail.Presentiel]: 'Présentiel',
    [ModeTravail.Hybride]: 'Hybride',
    [ModeTravail.Teletravail]: 'Télétravail'
  };

  statutLabels = {
    [StatutOffre.Ouvert]: 'Ouvert',
    [StatutOffre.cloturer ]: 'cloturer ',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService
  ) {}

  ngOnInit(): void {
    this.idOffreEmploi = this.route.snapshot.paramMap.get('id');
    console.log('ID de l\'offre à charger:', this.idOffreEmploi);
    
    if (this.idOffreEmploi) {
      this.loadJobDetails(this.idOffreEmploi);
    } else {
      this.error = "Aucune offre d'emploi sélectionnée.";
      this.loading = false;
      setTimeout(() => this.router.navigate(['/job-list']), 3000);
    }
  }

  loadJobDetails(idOffreEmploi: string): void {
    this.loading = true;
    this.offreService.getOffreEmploi(idOffreEmploi).subscribe({
      next: (response) => {
        console.log('Réponse brute de l\'API:', JSON.stringify(response, null, 2));
        
        // Extraction des données selon la structure de la réponse
        const offre = response;
        console.log('Offre extraite:', JSON.stringify(offre, null, 2));
        
        this.offre = offre;
        
        if (offre && offre.idFiliale) {
          console.log('ID de la filiale à charger:', offre.idFiliale);
          this.loadFilialeDetails(offre.idFiliale);
        } else {
          console.warn('Pas d\'ID filiale trouvé dans l\'offre');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'offre:', error);
        this.error = `Erreur lors du chargement de l'offre: ${error.message}`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/job-list']), 3000);
      }
    });
  }

  loadFilialeDetails(idFiliale: string): void {
    this.filialeService.getFiliale(idFiliale).subscribe({
      next: (response) => {
        console.log('Réponse brute de la filiale:', JSON.stringify(response, null, 2));
        
        // Extraction des données selon la structure de la réponse
        const filiale = response;
        console.log('Filiale extraite:', JSON.stringify(filiale, null, 2));
        
        this.filiale = filiale;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des informations de l\'entreprise:', error);
        this.error = `Erreur lors du chargement des informations de l'entreprise: ${error.message}`;
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Non spécifié';
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return parsedDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return 'Date invalide';
    }
  }

  getTypeContratLabel(type: TypeContratEnum | undefined): string {
    if (type === undefined || type === null) return 'Non spécifié';
    return this.typeContratLabels[type] || `Type contrat (${type})`;
  }

  getContractColor(type: TypeContratEnum | undefined): string {
    if (type === undefined || type === null) return '#6c757d';
    switch (type) {
      case TypeContratEnum.CDI: return '#28a745';
      case TypeContratEnum.CDD: return '#007bff';
      case TypeContratEnum.Freelance: return '#ffc107';
      case TypeContratEnum.Stage: return '#dc3545';
      case TypeContratEnum.Alternance: return '#17a2b8';
      default: return '#6c757d';
    }
  }

  getModeTravailLabel(mode: ModeTravail | undefined): string {
    if (mode === undefined || mode === null) return 'Non spécifié';
    return this.modeTravailLabels[mode] || `Mode travail (${mode})`;
  }

  getStatutLabel(statut: StatutOffre | undefined): string {
    if (statut === undefined || statut === null) return 'Non spécifié';
    return this.statutLabels[statut] || `Statut (${statut})`;
  }

  isOffrePosulable(): boolean {
    return this.offre?.statut === StatutOffre.Ouvert;
  }

  applyForJob(): void {
    if (!this.isOffrePosulable()) {
      alert('Cette offre n\'est plus disponible pour les candidatures.');
      return;
    }
    
    alert('Redirection vers le formulaire de candidature...');
    // Implémenter la logique de candidature ici
  }
}