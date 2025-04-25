import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Candidature } from '../../Models/Candidature.model';
import { CandidateurSharedService } from '../../shared/services/candidateur-shared.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './candidature-list.component.html',
  styleUrls: ['./candidature-list.component.css']
})
export class CandidatureListComponent implements OnInit {
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  paginatedCandidatures: Candidature[] = [];
  statusOptions: string[] = ['Soumise', 'En revue', 'Acceptée', 'Rejetée'];
  sidebarOpen: boolean = false;
  searchForm: FormGroup;
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private candidatureService: CandidateurSharedService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      fullName: [''],
      offreTitre: [''],
      statut: ['']
    });
  }

  ngOnInit(): void {
    this.loadCandidatures();
    this.searchForm.valueChanges.subscribe((value) => this.searchCandidatures(value));
  }

  loadCandidatures(): void {
    this.candidatureService.getAllCandidatures().subscribe({
      next: (data) => {
        this.candidatures = data || [];
        this.filteredCandidatures = [...this.candidatures];
        this.totalItems = this.filteredCandidatures.length;
        this.updatePaginatedCandidatures();
        console.log('Candidatures chargées :', this.candidatures);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des candidatures : ' + error.message,
        });
        console.error('Erreur lors du chargement des candidatures', error);
      }
    });
  }

  deleteCandidature(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidatureService.deleteCandidature(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé!',
              'La candidature a été supprimée avec succès.',
              'success'
            );
            this.loadCandidatures(); // Rechargez la liste
          },
          error: (error) => {
            Swal.fire(
              'Erreur!',
              'Erreur lors de la suppression: ' + error.message,
              'error'
            );
          }
        });
      }
    });
  }

  searchCandidatures(searchParams: any): void {
    const { fullName, offreTitre, statut } = searchParams;

    if (!fullName && !offreTitre && !statut) {
      this.filteredCandidatures = [...this.candidatures];
      this.totalItems = this.filteredCandidatures.length;
      this.currentPage = 0;
      this.updatePaginatedCandidatures();
      return;
    }

    this.filteredCandidatures = this.candidatures.filter(candidature => {
      const matchesFullName = fullName
        ? candidature.appUser.fullName.toLowerCase().includes(fullName.toLowerCase())
        : true;
      const matchesOffreTitre = offreTitre
        ? candidature.offreTitre.toLowerCase().includes(offreTitre.toLowerCase())
        : true;
      const matchesStatut = statut ? candidature.statut === statut : true;

      return matchesFullName && matchesOffreTitre && matchesStatut;
    });

    this.totalItems = this.filteredCandidatures.length;
    this.currentPage = 0;
    this.updatePaginatedCandidatures();
  }

  updatePaginatedCandidatures(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredCandidatures.length);
    this.paginatedCandidatures = this.filteredCandidatures.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedCandidatures();
  }

  updateStatus(candidature: Candidature, newStatus: string): void {
    this.candidatureService.updateCandidatureStatus(candidature.idCandidature, newStatus).subscribe({
      next: () => {
        candidature.statut = newStatus;
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Statut mis à jour avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Mise à Jour',
          text: 'Échec de la mise à jour du statut : ' + error.message,
        });
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/candidature', id]);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}