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
      idRecruteur: [''],
      query: [''],
      typeContrat: [''],
      statut: [''],
      modeTravail: ['']
    });
  }

  ngOnInit(): void {
    this.loadFiliales();
    this.searchForm.valueChanges.subscribe(value => this.loadOffresByRecruteur(value));
    this.loadOffresByRecruteur({ idRecruteur: '', query: '', typeContrat: '', statut: '', modeTravail: '' }); // Chargement initial
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

  loadOffresByRecruteur(searchParams: any): void {
    const { idRecruteur, query, typeContrat, statut, modeTravail } = searchParams;

    if (!idRecruteur) {
      // Si aucun recruteur n'est sélectionné, charger toutes les offres
      this.offreService.getAll().subscribe({
        next: (offres) => {
          this.offres = offres;
          this.filteredOffres = this.applyFilters(offres, query, typeContrat, statut, modeTravail);
          this.totalItems = this.filteredOffres.length;
          this.updatePaginatedOffres();
          if (offres.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Aucun Résultat',
              text: 'Aucune offre disponible.',
              showConfirmButton: true
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de Chargement',
            text: 'Échec du chargement des offres : ' + error.message,
          });
          this.filteredOffres = [];
          this.totalItems = 0;
          this.updatePaginatedOffres();
        }
      });
      return;
    }

    // Charger les offres par recruteur et appliquer les filtres
    this.offreService.getByRecruteur(idRecruteur).subscribe({
      next: (offres) => {
        this.offres = offres;
        this.filteredOffres = this.applyFilters(offres, query, typeContrat, statut, modeTravail);
        this.totalItems = this.filteredOffres.length;
        this.updatePaginatedOffres();
        if (offres.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Aucun Résultat',
            text: 'Aucune offre ne correspond à ce recruteur.',
            showConfirmButton: true
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des offres : ' + (error.message || 'Erreur inconnue'),
        });
        this.filteredOffres = [];
        this.totalItems = 0;
        this.updatePaginatedOffres();
      }
    });
  }

  applyFilters(offres: OffreEmploi[], query: string, typeContrat: string, statut: string, modeTravail: string): OffreEmploi[] {
    let filtered = [...offres];

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(offre =>
        (this.getTitre(offre)?.toLowerCase().includes(lowerQuery) || offre.specialite?.toLowerCase().includes(lowerQuery))
      );
    }

    if (typeContrat) {
      filtered = filtered.filter(offre => offre.typeContrat.toString() === typeContrat);
    }

if (statut) {
  filtered = filtered.filter(offre => offre.statut.toString() === statut);
}

    if (modeTravail) {
      filtered = filtered.filter(offre => offre.modeTravail.toString() === modeTravail);
    }

    return filtered;
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

  deleteOffre(id: string): void {
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