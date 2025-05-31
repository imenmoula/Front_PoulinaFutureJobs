
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/user.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2'; // Ajout de l'importation de SweetAlert2

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterLink,
    PaginationComponent
  ],
  templateUrl: './candidate-list.component.html',
  styles: ``
})
export class CandidateListComponent implements OnInit {
  candidates: User[] = [];
  filteredCandidates: User[] = [];
  paginatedCandidates: User[] = [];
  searchForm: FormGroup;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  pageSize = 3;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
    fullName: [''],     // Doit correspondre au template
    offreTitre: [''],   // (erreur de frappe : "offreflire" → "offreTitre")
    statut: ['']        // dans le HTML
  });
  }

  ngOnInit(): void {
    this.getCandidates();
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => this.search(value));
  }

  getCandidates(): void {
    this.loading = true;
    this.userService.getUsersByRole('Candidate').subscribe({
      next: (response) => {
        console.log('Candidats chargés:', response);
        if (response.success) {
          if (Array.isArray(response.data)) {
            this.candidates = response.data.map((candidate: any) => ({
              id: candidate.id,
              email: candidate.email,
              fullName: candidate.fullName || `${candidate.prenom || ''} ${candidate.nom || ''}`.trim() || 'N/A',
              nom: candidate.nom || 'N/A',
              prenom: candidate.prenom || 'N/A',
              photo: candidate.photo,
              PhoneNumber: candidate.phone,
              entreprise: candidate.entreprise,
              poste: candidate.poste,
              role: typeof candidate.role === 'string' ? { id: uuidv4(), name: candidate.role, normalizedName: candidate.role.toUpperCase() } : candidate.role,
              UserRoles: candidate.UserRoles
            } as User));
            this.filteredCandidates = [...this.candidates];
            this.totalItems = this.filteredCandidates.length;
            this.updatePaginatedCandidates();
          } else {
            console.error('response.data is not an array:', response.data);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Les données des candidats ne sont pas valides.',
            });
            this.candidates = [];
            this.filteredCandidates = [];
            this.totalItems = 0;
            this.updatePaginatedCandidates();
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: response.message,
          });
          this.candidates = [];
          this.filteredCandidates = [];
          this.totalItems = 0;
          this.updatePaginatedCandidates();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidats', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Erreur lors du chargement des candidats.',
        });
        this.candidates = [];
        this.filteredCandidates = [];
        this.totalItems = 0;
        this.updatePaginatedCandidates();
        this.loading = false;
      }
    });
  }

  deleteCandidate(id: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce candidat ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.candidates = this.candidates.filter(c => c.id !== id);
            this.filteredCandidates = this.filteredCandidates.filter(c => c.id !== id);
            this.totalItems = this.filteredCandidates.length;
            this.updatePaginatedCandidates();
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Candidat supprimé avec succès !',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur de Suppression',
              text: 'Erreur lors de la suppression du candidat.',
            });
          }
        });
      }
    });
  }

  search(value: string): void {
    const searchTerm = value ? value.toLowerCase() : '';
    this.filteredCandidates = this.candidates.filter(candidate => {
      const matchesSearchTerm = !searchTerm ||
        (candidate.fullName && candidate.fullName.toLowerCase().includes(searchTerm)) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchTerm));
      return matchesSearchTerm;
    });

    this.totalItems = this.filteredCandidates.length;
    this.currentPage = 0;
    this.updatePaginatedCandidates();
  }

  updatePaginatedCandidates(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredCandidates.length);
    this.paginatedCandidates = this.filteredCandidates.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedCandidates();
  }

  onCancel(): void {
    this.searchForm.reset();
    this.filteredCandidates = [...this.candidates];
    this.totalItems = this.filteredCandidates.length;
    this.currentPage = 0;
    this.updatePaginatedCandidates();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}