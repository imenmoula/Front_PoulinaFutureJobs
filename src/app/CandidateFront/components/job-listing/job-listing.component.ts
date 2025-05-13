import { TypeContratEnum } from './../../../Models/enums.model';
// import { Component, OnInit } from '@angular/core';
// import { OffreEmploi } from '../../../Models/offre-emploi.model';
// import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
// import { FilialeService } from '../../../shared/services/filiale.service';
// import { Filiale } from '../../../Models/filiale.model';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { TypeContratEnum } from '../../../Models/enums.model';
// import { AuthService } from '../../../shared/services/auth.service';

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
//   filiales: { [key: string]: Filiale } = {};
//   filialesList: Filiale[] = [];
//   specialite: string = '';
//   titrePoste: string = '';
//   typeContrat: string = '';
//   modeTravail: string = '';
//   niveauExperienceRequis: string = '';
//   selectedFiliale: string = '';

//   currentPage: number = 1;
//   itemsPerPage: number = 5;
//   totalPages: number = 1;
//   errorMessage: string = '';

//   constructor(
//     private offreService: OffreEmploiService,
//     private filialeService: FilialeService,
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.selectedFiliale = params['idFiliale'] || '';
//       this.loadFiliales();
//       this.loadOffres();
//     });
//   }

//   loadOffres(): void {
//    this.offreService.getAll().subscribe(
//   (response: OffreEmploi[]) => {
//     this.offres = response || [];
//     if (this.offres.length === 0) {
//       this.errorMessage = 'Aucune offre disponible pour le moment.';
//     }
//     this.filterOffres();
//   },
//   (error: any) => {
//     this.errorMessage = 'Erreur lors du chargement des offres : ' + error.message;
//     console.error('Error loading offers:', error);
//   }
// );
//   }

//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe(
//       (filiales: Filiale[]) => {
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

//   filterOffres(): void {
//     this.filteredOffres = [...this.offres]; // Start with all offers
//     if (this.titrePoste) {
//       this.filteredOffres = this.filteredOffres.filter(offre =>
//         offre.postes.some(poste => poste.titrePoste.toLowerCase().includes(this.titrePoste.toLowerCase()))
//       );
//     }
//     if (this.specialite) {
//       this.filteredOffres = this.filteredOffres.filter(offre =>
//         offre.specialite.toLowerCase().includes(this.specialite.toLowerCase())
//       );
//     }
//     if (this.niveauExperienceRequis) {
//       this.filteredOffres = this.filteredOffres.filter(offre =>
//         offre.niveauExperienceRequis.toLowerCase().includes(this.niveauExperienceRequis.toLowerCase())
//       );
//     }
//     if (this.typeContrat) {
//         this.filteredOffres = this.filteredOffres.filter(offre =>
//           String(offre.typeContrat).toLowerCase() === String(this.typeContrat).toLowerCase()
//         );
//       }
    

// if (this.modeTravail) {
//   this.filteredOffres = this.filteredOffres.filter(offre =>
//     String(offre.modeTravail).toLowerCase() === String(this.modeTravail).toLowerCase()
//   );
// }
//     if (this.selectedFiliale) {
//       this.filteredOffres = this.filteredOffres.filter(offre =>
//         offre.idFiliale === this.selectedFiliale
//       );
//     }
//     if (this.filteredOffres.length === 0) {
//       this.errorMessage = 'Aucune offre d\'emploi correspondant à vos critères.';
//     } else {
//       this.errorMessage = '';
//     }
//     this.updatePagination();
//   }

//   onFilterChange(): void {
//     this.currentPage = 1;
//     this.filterOffres();
//   }

//   updatePagination(): void {
//     this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
//     this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
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

//   getContractColor(type: TypeContratEnum): string {
//     switch (type) {
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
//     let interval = seconds / 31536000;
//     if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
//     interval = seconds / 2592000;
//     if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
//     interval = seconds / 86400;
//     if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
//     interval = seconds / 3600;
//     if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
//     interval = seconds / 60;
//     if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
//     return `il y a ${Math.floor(seconds)} secondes`;
//   }

//   onLogout(): void {
//     this.authService.deleteToken();
//     this.router.navigateByUrl('/signin');
//   }

//   // Ajoutez ces méthodes à votre classe JobListingComponent

// setTypeContrat(type: string): void {
//   this.typeContrat = this.typeContrat === type ? '' : type;
//   this.onFilterChange();
// }

// setModeTravail(mode: string): void {
//   this.modeTravail = this.modeTravail === mode ? '' : mode;
//   this.onFilterChange();
// }

// setSpecialite(spec: string): void {
//   this.specialite = this.specialite === spec ? '' : spec;
//   this.onFilterChange();
// }

// setExperience(exp: string): void {
//   this.niveauExperienceRequis = this.niveauExperienceRequis === exp ? '' : exp;
//   this.onFilterChange();
// }

// resetFilters(): void {
//   this.titrePoste = '';
//   this.specialite = '';
//   this.typeContrat = '';
//   this.modeTravail = '';
//   this.niveauExperienceRequis = '';
//   this.selectedFiliale = '';
//   this.onFilterChange();
// }
// }

import { Component, OnInit } from '@angular/core';
import { OffreEmploi } from '../../../Models/offre-emploi.model';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { FilialeService } from '../../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.css']
})
export class JobListingComponent implements OnInit {
  offres: OffreEmploi[] = [];
  filteredOffres: OffreEmploi[] = [];
  filiales: { [key: string]: Filiale } = {};
  filialesList: Filiale[] = [];
  
  // Propriétés de recherche
  titrePoste: string = '';
  
  // Filtres sélectionnés
  selectedTypesContrat: string[] = [];
  selectedModesTravail: string[] = [];
  selectedSpecialites: string[] = [];
  selectedNiveauxExperience: string[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  errorMessage: string = '';
  
  // Options de filtres
  specialites: string[] = [
    'Finance',
    'Informatique',
    'Ressources Humaines',
    'Marketing',
    'Logistique',
    'Production',
    'Qualité',
    'Maintenance'
  ];
  
  niveauxExperience: string[] = [
    'Débutant',
    '1-3 ans',
    '3-5 ans',
    '5+ ans'
  ];
  
  typesContrat: string[] = [
    'CDI',
    'CDD',
    'Stage',
    'Alternance',
    'Freelance'
  ];
  
  modesTravail: string[] = [
    'Présentiel',
    'Hybride',
    'Télétravail'
  ];
  
  currentYear: number = new Date().getFullYear();

  constructor(
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idFiliale = params['idFiliale'] || '';
      this.loadFiliales();
      this.loadOffres();
    });
  }

  loadOffres(): void {
    this.offreService.getAll().subscribe(
      (response: OffreEmploi[]) => {
        this.offres = response || [];
        if (this.offres.length === 0) {
          this.errorMessage = 'Aucune offre disponible pour le moment.';
        }
        this.filterOffres();
      },
      (error: any) => {
        this.errorMessage = 'Erreur lors du chargement des offres : ' + error.message;
        console.error('Error loading offers:', error);
      }
    );
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe(
      (filiales: Filiale[]) => {
        this.filialesList = filiales || [];
        this.filiales = this.filialesList.reduce((acc, filiale) => {
          acc[filiale.idFiliale] = filiale;
          return acc;
        }, {} as { [key: string]: Filiale });
      },
      (error: any) => {
        console.error('Error loading filiales:', error);
      }
    );
  }

  filterOffres(): void {
    this.filteredOffres = this.offres.filter(offre => {
      // Filtre par titre de poste
      const matchesTitre = !this.titrePoste || 
        offre.postes.some(poste => 
          poste.titrePoste.toLowerCase().includes(this.titrePoste.toLowerCase())
        );
      
      // Filtre par type de contrat
      const matchesTypeContrat = this.selectedTypesContrat.length === 0 || 
this.selectedTypesContrat.includes(TypeContratEnum[offre.typeContrat])
      
      // Filtre par mode de travail
      const matchesModeTravail = this.selectedModesTravail.length === 0 || 
this.selectedTypesContrat.includes(TypeContratEnum[offre.typeContrat])
      
      // Filtre par spécialité
      const matchesSpecialite = this.selectedSpecialites.length === 0 || 
        this.selectedSpecialites.includes(offre.specialite);
      
      // Filtre par niveau d'expérience
      const matchesExperience = this.selectedNiveauxExperience.length === 0 || 
        this.selectedNiveauxExperience.includes(offre.niveauExperienceRequis);
      
      return matchesTitre && matchesTypeContrat && matchesModeTravail && 
             matchesSpecialite && matchesExperience;
    });
    
    this.errorMessage = this.filteredOffres.length === 0 
      ? 'Aucune offre d\'emploi correspondant à vos critères.' 
      : '';
    
    this.updatePagination();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.filterOffres();
  }

  // Méthodes pour gérer les filtres
  toggleTypeContrat(type: string): void {
    const index = this.selectedTypesContrat.indexOf(type);
    if (index === -1) {
      this.selectedTypesContrat.push(type);
    } else {
      this.selectedTypesContrat.splice(index, 1);
    }
    this.onFilterChange();
  }

  toggleModeTravail(mode: string): void {
    const index = this.selectedModesTravail.indexOf(mode);
    if (index === -1) {
      this.selectedModesTravail.push(mode);
    } else {
      this.selectedModesTravail.splice(index, 1);
    }
    this.onFilterChange();
  }

  toggleSpecialite(spec: string): void {
    const index = this.selectedSpecialites.indexOf(spec);
    if (index === -1) {
      this.selectedSpecialites.push(spec);
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

  resetFilters(): void {
    this.titrePoste = '';
    this.selectedTypesContrat = [];
    this.selectedModesTravail = [];
    this.selectedSpecialites = [];
    this.selectedNiveauxExperience = [];
    this.onFilterChange();
  }

  // Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  getPaginatedOffres(): OffreEmploi[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOffres.slice(startIndex, endIndex);
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

  // Utilitaires
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

  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

  
}