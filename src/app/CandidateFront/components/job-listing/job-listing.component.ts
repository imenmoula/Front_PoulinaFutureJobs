import { ModeTravail, TypeContratEnum } from './../../../Models/enums.model';
import { Component, OnInit } from '@angular/core';
import { OffreEmploi } from '../../../Models/offre-emploi.model';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { FilialeService } from '../../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { SharedModule } from '../../../shared/shared.module';

interface QuickFilter {
  label: string;
  type: 'contrat' | 'mode';
  value: TypeContratEnum | ModeTravail;
  active: boolean;
  icon: string;
}

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule , SharedModule],
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.css']
})
export class JobListingComponent implements OnInit {
  offres: OffreEmploi[] = [];
  filteredOffres: OffreEmploi[] = [];
  filiales: Filiale[] = [];
  
  // Propriétés de recherche
  titrePoste: string = '';
  selectedFiliale: string = '';
  
  // Filtres sélectionnés
  selectedTypesContrat: TypeContratEnum[] = [];
  selectedModesTravail: ModeTravail[] = [];
  selectedSpecialites: string[] = [];
  selectedNiveauxExperience: string[] = [];
  
  // Options de filtres
typesContrat: TypeContratEnum[] = Object.values(TypeContratEnum) as TypeContratEnum[];
modesTravail: ModeTravail[] = Object.values(ModeTravail) as ModeTravail[];
  specialites: string[] = [];
  niveauxExperience: string[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  errorMessage: string = '';
  isLoading: boolean = true;
  currentYear = new Date().getFullYear();
  
  // Filtres rapides
  quickFilters: QuickFilter[] = [
    { 
      label: 'CDI', 
      type: 'contrat', 
      value: TypeContratEnum.CDI, 
      active: false,
      icon: 'file-contract' 
    },
    { 
      label: 'CDD', 
      type: 'contrat', 
      value: TypeContratEnum.CDD, 
      active: false,
      icon: 'file-contract' 
    },
    { 
      label: 'Stage', 
      type: 'contrat', 
      value: TypeContratEnum.Stage, 
      active: false,
      icon: 'file-contract' 
    },
    { 
      label: 'Alternance', 
      type: 'contrat', 
      value: TypeContratEnum.Alternance, 
      active: false,
      icon: 'file-contract' 
    },
    { 
      label: 'Télétravail', 
      type: 'mode', 
      value: ModeTravail.Teletravail, 
      active: false,
      icon: 'laptop-house' 
    },
    { 
      label: 'Hybride', 
      type: 'mode', 
      value: ModeTravail.Hybride, 
      active: false,
      icon: 'house-laptop' 
    }
  ];

  constructor(
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedFiliale = params['idFiliale'] || '';
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.loadFiliales();
    this.loadOffres();
  }

  loadOffres(): void {
    this.offreService.getAll().subscribe({
      next: (response: OffreEmploi[]) => {
        this.offres = response || [];
        this.filteredOffres = [...this.offres];
        this.extractSpecialites();
        this.extractNiveauxExperience();
        this.isLoading = false;
        
        if (this.offres.length === 0) {
          this.errorMessage = 'Aucune offre disponible pour le moment.';
        } else {
          this.errorMessage = '';
        }
        this.updatePagination();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des offres : ' + error.message;
        console.error('Error loading offers:', error);
        this.isLoading = false;
      }
    });
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales: Filiale[]) => {
        this.filiales = filiales || [];
      },
      error: (error) => {
        console.error('Error loading filiales:', error);
      }
    });
  }

  extractSpecialites(): void {
    this.specialites = [...new Set(this.offres.map(o => o.specialite).filter(s => s))];
  }

  extractNiveauxExperience(): void {
    this.niveauxExperience = [...new Set(this.offres.map(o => o.niveauExperienceRequis).filter(n => n))];
  }

  getFiliale(idFiliale: string): Filiale | undefined {
    return this.filiales.find(f => f.idFiliale === idFiliale);
  }

  filterOffres(): void {
    this.filteredOffres = this.offres.filter(offre => {
      // Filtre par titre de poste
      const matchesTitre = !this.titrePoste || 
        offre.postes?.some(poste => 
          poste.titrePoste?.toLowerCase().includes(this.titrePoste.toLowerCase())
        );
      
      // Filtre par type de contrat
      const matchesTypeContrat = this.selectedTypesContrat.length === 0 || 
        this.selectedTypesContrat.includes(offre.typeContrat);
      
      // Filtre par mode de travail
      const matchesModeTravail = this.selectedModesTravail.length === 0 || 
        this.selectedModesTravail.includes(offre.modeTravail);
      
      // Filtre par filiale
      const matchesFiliale = !this.selectedFiliale || 
        offre.idFiliale === this.selectedFiliale;
      
      // Filtre par spécialité
      const matchesSpecialite = this.selectedSpecialites.length === 0 || 
        this.selectedSpecialites.includes(offre.specialite);
      
      // Filtre par niveau d'expérience
      const matchesNiveauExperience = this.selectedNiveauxExperience.length === 0 || 
        this.selectedNiveauxExperience.includes(offre.niveauExperienceRequis);
      
      return matchesTitre && matchesTypeContrat && matchesModeTravail && 
             matchesFiliale && matchesSpecialite && matchesNiveauExperience;
    });
    
    this.errorMessage = this.filteredOffres.length === 0 
      ? 'Aucune offre correspondant à vos critères.' 
      : '';
    
    this.updatePagination();
  }

  isFilterActive(filter: QuickFilter): boolean {
    if (filter.type === 'contrat') {
      return this.selectedTypesContrat.includes(filter.value as TypeContratEnum);
    } else if (filter.type === 'mode') {
      return this.selectedModesTravail.includes(filter.value as ModeTravail);
    }
    return false;
  }

  applyQuickFilter(filter: QuickFilter): void {
    filter.active = !filter.active;
    if (filter.type === 'contrat') {
      this.toggleTypeContrat(filter.value as TypeContratEnum);
    } else if (filter.type === 'mode') {
      this.toggleModeTravail(filter.value as ModeTravail);
    }
  }

  toggleTypeContrat(type: TypeContratEnum): void {
    const index = this.selectedTypesContrat.indexOf(type);
    if (index === -1) {
      this.selectedTypesContrat.push(type);
    } else {
      this.selectedTypesContrat.splice(index, 1);
    }
    this.onFilterChange();
  }

  toggleModeTravail(mode: ModeTravail): void {
    const index = this.selectedModesTravail.indexOf(mode);
    if (index === -1) {
      this.selectedModesTravail.push(mode);
    } else {
      this.selectedModesTravail.splice(index, 1);
    }
    this.onFilterChange();
  }

  toggleSpecialite(specialite: string): void {
    const index = this.selectedSpecialites.indexOf(specialite);
    if (index === -1) {
      this.selectedSpecialites.push(specialite);
    } else {
      this.selectedSpecialites.splice(index, 1);
    }
    this.onFilterChange();
  }

  toggleNiveauExperience(niveau: string): void {
    const index = this.selectedNiveauxExperience.indexOf(niveau);
    if (index === -1) {
      this.selectedNiveauxExperience.push(niveau);
    } else {
      this.selectedNiveauxExperience.splice(index, 1);
    }
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.filterOffres();
  }

  resetFilters(): void {
    this.titrePoste = '';
    this.selectedTypesContrat = [];
    this.selectedModesTravail = [];
    this.selectedSpecialites = [];
    this.selectedNiveauxExperience = [];
    this.selectedFiliale = '';
    this.quickFilters.forEach(f => f.active = false);
    this.onFilterChange();
  }

  // Méthodes de pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage) || 1;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  getPaginatedOffres(): OffreEmploi[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOffres.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getContractColor(type: TypeContratEnum): string {
    switch (type) {
      case TypeContratEnum.CDI: return '#28a745';
      case TypeContratEnum.CDD: return '#007bff';
      case TypeContratEnum.Stage: return '#4169E1';
      case TypeContratEnum.Alternance: return '#17a2b8';
      default: return '#6c757d';
    }
  }

  timeSince(date: any): string {
    if (!date) return 'Inconnu';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
    interval = seconds / 2592000;
    if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
    interval = seconds / 86400;
    if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
    interval = seconds / 3600;
    if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
    interval = seconds / 60;
    if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
    return `il y a ${Math.floor(seconds)} secondes`;
  }

  formatDate(date: any): string {
    if (!date) return 'Non spécifié';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return 'Date invalide';
    }
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }
}