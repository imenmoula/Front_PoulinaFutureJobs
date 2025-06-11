

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import { Filiale } from '../../Models/filiale.model';
import { ModeTravail, StatutOffre, TypeContratEnum } from '../../Models/enums.model';

@Component({
  selector: 'app-offre-list',
  standalone: true,
  templateUrl: './offre-list.component.html',
  styleUrls: ['./offre-list.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    PaginationComponent
  ]
})
export class OffreListComponent implements OnInit {
  offres: OffreEmploi[] = [];
  filteredOffres: OffreEmploi[] = [];
  paginatedOffres: OffreEmploi[] = [];
  filiales: Filiale[] = [];
  sidebarOpen: boolean = false;
  searchForm: FormGroup;
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;

  typeContrats = Object.values(TypeContratEnum);
  statuts = Object.values(StatutOffre);
  modesTravail = Object.values(ModeTravail);

  constructor(
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      typeContrat: [''],
      statut: [''],
      modeTravail: ['']
    });
  }

  ngOnInit(): void {
  this.loadFiliales();
  this.searchForm.valueChanges.subscribe(value => this.applyFilters(value));
  
  // Temporary fix - use getAll() instead of getByConnectedRecruteur()
  this.offreService.getAll().subscribe({
    next: (offres) => {
      this.offres = offres;
      this.filteredOffres = [...offres];
      this.totalItems = this.filteredOffres.length;
      this.updatePaginatedOffres();
    },
    error: (error) => {
      console.error('Error:', error);
      this.offres = [];
      this.filteredOffres = [];
      this.totalItems = 0;
      this.updatePaginatedOffres();
    }
  });
}

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des filiales : ' + error.message,
        });
      }
    });
  }
private checkAuthentication(): boolean {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return !!token;
}
 // Updated loadOffres method in your component
loadOffres(): void {
  this.offreService.getByConnectedRecruteur().subscribe({
    next: (offres) => {
      console.log('Offres loaded:', offres);
      this.offres = offres;
      this.filteredOffres = [...offres];
      this.totalItems = this.filteredOffres.length;
      this.updatePaginatedOffres();
      
      if (offres.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Aucun Résultat',
          text: 'Aucune offre disponible pour ce recruteur.',
          showConfirmButton: true
        });
      }
    },
    error: (error) => {
      console.error('Error loading offres:', error);
      
      if (error.message === 'SESSION_EXPIRED') {
        this.handleSessionExpired();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des offres : ' + (error.message || 'Erreur inconnue'),
        });
      }
      
      this.offres = [];
      this.filteredOffres = [];
      this.totalItems = 0;
      this.updatePaginatedOffres();
    }
  });
}

private handleSessionExpired(): void {
  localStorage.removeItem('token');
  Swal.fire({
    icon: 'warning',
    title: 'Session expirée',
    text: 'Votre session a expiré. Veuillez vous reconnecter.',
    confirmButtonText: 'Se connecter'
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/login']);
    }
  });
}

  applyFilters({ query, typeContrat, statut, modeTravail }: any): void {
    let filtered = [...this.offres];

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(offre =>
        (this.getTitre(offre)?.toLowerCase().includes(lowerQuery) ||
         offre.specialite?.toLowerCase().includes(lowerQuery))
      );
    }

    if (typeContrat) {
      filtered = filtered.filter(offre => offre.typeContrat === typeContrat);
    }

    if (statut) {
      filtered = filtered.filter(offre => offre.statut === statut);
    }

    if (modeTravail) {
      filtered = filtered.filter(offre => offre.modeTravail === modeTravail);
    }

    this.filteredOffres = filtered;
    this.totalItems = this.filteredOffres.length;
    this.currentPage = 0; // Reset to first page
    this.updatePaginatedOffres();
  }

  updatePaginatedOffres(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredOffres.length);
    this.paginatedOffres = this.filteredOffres.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedOffres();
  }

  getNomFiliale(idFiliale: string | undefined): string {
    if (!idFiliale) return 'Filiale inconnue';
    const filiale = this.filiales.find(f => f.idFiliale === idFiliale);
    return filiale ? filiale.nom : 'Filiale inconnue';
  }

  getTitre(offre: OffreEmploi): string {
    return offre.postes && offre.postes.length > 0 ? offre.postes[0].titrePoste || 'Sans titre' : 'Sans titre';
  }

  getNombrePostes(offre: OffreEmploi): number {
    return offre.postes ? offre.postes.reduce((sum, poste) => sum + (poste.nombrePostes || 0), 0) : 0;
  }

  viewOffre(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/offres/details', id]);
    }
  }
  private handleAuthenticationError(): void {
  Swal.fire({
    icon: 'warning',
    title: 'Session Expirée',
    text: 'Votre session a expiré. Vous allez être redirigé vers la page de connexion.',
    showConfirmButton: true
  }).then(() => {
    // Clear any stored tokens
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to login page
    this.router.navigate(['/login']);
  });
}

  editOffre(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/offres/update', id]);
    }
  }

  deleteOffre(id: string | undefined): void {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'ID de l\'offre invalide.',
      });
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cette offre ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.offreService.deleteOffre(id).subscribe({
          next: () => {
            this.offres = this.offres.filter(o => o.idOffreEmploi !== id);
            this.filteredOffres = this.filteredOffres.filter(o => o.idOffreEmploi !== id);
            this.totalItems = this.filteredOffres.length;
            this.updatePaginatedOffres();
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Offre supprimée avec succès',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur de Suppression',
              text: 'Échec de la suppression de l\'offre : ' + (error.message || 'Erreur inconnue'),
            });
          }
        });
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}