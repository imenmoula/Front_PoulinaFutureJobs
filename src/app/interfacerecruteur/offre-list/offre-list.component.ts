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
      titre: [''],
      specialite: [''],
      typeContrat: [''],
      statut: [''],
      modeTravail: [''],
      idFiliale: ['']
    });
  }

  ngOnInit(): void {
    this.loadFiliales();
    this.loadOffres();
    this.searchForm.valueChanges.subscribe(value => this.searchOffres(value));
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

  loadOffres(): void {
    this.offreService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.offres = response.offresEmploi || [];
          this.filteredOffres = [...this.offres];
          this.totalItems = this.filteredOffres.length;
          this.updatePaginatedOffres();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de Chargement',
            text: response.message || 'Échec du chargement des offres.',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des offres : ' + error.message,
        });
      }
    });
  }

  searchOffres(searchParams: any): void {
    const { titre, specialite, typeContrat, statut, modeTravail, idFiliale } = searchParams;

    if (!titre && !specialite && !typeContrat && !statut && !modeTravail && !idFiliale) {
      this.filteredOffres = [...this.offres];
      this.totalItems = this.filteredOffres.length;
      this.currentPage = 0;
      this.updatePaginatedOffres();
      return;
    }

    this.offreService.search(titre, specialite, typeContrat, statut, modeTravail, idFiliale).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredOffres = response.offresEmploi || [];
          this.totalItems = this.filteredOffres.length;
          this.currentPage = 0;
          this.updatePaginatedOffres();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de Recherche',
            text: response.message || 'Échec de la recherche des offres.',
          });
          this.filteredOffres = [];
          this.totalItems = 0;
          this.updatePaginatedOffres();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Recherche',
          text: error.error?.message || 'Échec de la recherche des offres.',
        });
        this.filteredOffres = [];
        this.totalItems = 0;
        this.updatePaginatedOffres();
      }
    });
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

  getNomFiliale(idFiliale: string): string {
    const filiale = this.filiales.find(f => f.idFiliale === idFiliale);
    return filiale ? filiale.nom : 'Filiale inconnue';
  }

  getTitre(offre: OffreEmploi): string {
    return offre.postes && offre.postes.length > 0 ? offre.postes[0].titrePoste : 'Sans titre';
  }

  getNombrePostes(offre: OffreEmploi): number {
    return offre.postes ? offre.postes.reduce((sum, poste) => sum + poste.nombrePostes, 0) : 0;
  }

  editOffre(id: string): void {
    this.router.navigate(['/offres/update', id]);
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
          next: (response:any) => {
            if (response.success) {
              this.offres = this.offres.filter(o => o.idOffreEmploi !== id);
              this.filteredOffres = this.filteredOffres.filter(o => o.idOffreEmploi !== id);
              this.totalItems = this.filteredOffres.length;
              this.updatePaginatedOffres();
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: response.message || 'Offre supprimée avec succès',
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erreur de Suppression',
                text: response.message || 'Échec de la suppression de l\'offre.',
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur de Suppression',
              text: 'Échec de la suppression de l\'offre : ' + (error.error?.message || error.message),
            });
          }
        });
      }
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/offres/details', id]);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}