import { OffreEmploi } from './../../Models/offre-emploi.model';


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { TypeContratEnum, StatutOffre, ModeTravail } from '../../Models/enums.model'; // Ajout de ModeTravail
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offre-list',
  standalone: true,
  templateUrl: './offre-list.component.html',
  styles: ``,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    PaginationComponent
  ]
})
export class OffreListComponent implements OnInit {
  offres: any[] = [];
  filteredOffres: any[] = [];
  paginatedOffres: any[] = [];
  filiales: any[] = [];
  sidebarOpen: boolean = false;
  searchForm: FormGroup;
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;

  typeContrats = Object.entries(TypeContratEnum).filter(([k, v]) => isNaN(Number(k)));
  statuts = Object.entries(StatutOffre).filter(([k, v]) => isNaN(Number(k)));
  modesTravail = Object.entries(ModeTravail).filter(([k, v]) => isNaN(Number(k))); // Ajout de modesTravail

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
      modeTravail: [''] // Ajout de modeTravail dans le formulaire
    });
  }

  ngOnInit(): void {
    this.loadFiliales();
    this.loadOffres();
    this.searchForm.valueChanges.subscribe((value) => this.searchOffres(value));
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
        console.log('Filiales chargées :', this.filiales);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des filiales : ' + error.message,
        });
        console.error('Erreur lors du chargement des filiales :', error);
      }
    });
  }

  getNomFiliale(idFiliale: string): string {
    const filiale = this.filiales.find(f => f.idFiliale === idFiliale);
    return filiale ? filiale.nom : 'Filiale inconnue';
  }

  getEnumValue(enumArray: any[], enumValue: number): string {
    const enumItem = enumArray.find(item => item[1] === enumValue);
    return enumItem ? enumItem[0] : 'Inconnu';
  }

  loadOffres(): void {
    this.offreService.getAllOffres().subscribe({
      next: (response) => {
        this.offres = response;
        this.filteredOffres = [...this.offres];
        this.totalItems = this.filteredOffres.length;
        this.updatePaginatedOffres();
        console.log('Offres chargées :', this.offres);
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
    const { titre, specialite, typeContrat, statut, modeTravail } = searchParams; // Ajout de modeTravail

    if (!titre && !specialite && !typeContrat && !statut && !modeTravail) {
      this.filteredOffres = [...this.offres];
      this.totalItems = this.filteredOffres.length;
      this.currentPage = 0;
      this.updatePaginatedOffres();
      return;
    }

    console.log('Paramètres de recherche :', { titre, specialite, typeContrat, statut, modeTravail });

    this.offreService.searchOffres(titre, specialite, typeContrat, statut, modeTravail).subscribe({
      next: (response: any) => {
        this.filteredOffres = response.offresEmploi || [];
        this.totalItems = this.filteredOffres.length;
        this.currentPage = 0;
        this.updatePaginatedOffres();
        console.log('Résultats de la recherche :', this.filteredOffres);
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
              text: 'Échec de la suppression de l’offre : ' + error.message,
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