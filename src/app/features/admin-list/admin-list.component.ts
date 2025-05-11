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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-list',
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
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  admins: User[] = [];
  filteredAdmins: User[] = [];
  paginatedAdmins: User[] = [];
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
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.getAdmins();
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => this.search(value));
  }

  getAdmins(): void {
    this.loading = true;
    this.userService.getUsersByRole('Admin').subscribe({
      next: (response) => {
        if (response.success) {
          if (Array.isArray(response.data)) {
            this.admins = response.data.map((admin: any) => ({
              id: admin.id,
              email: admin.email,
              fullName: admin.fullName || `${admin.firstName || admin.nom || ''} ${admin.lastName || admin.prenom || ''}`.trim() || 'N/A',
              nom: admin.lastName || admin.nom || 'N/A',
              prenom: admin.firstName || admin.prenom || 'N/A',
              photo: admin.photo,
              phone: admin.phoneNumber || admin.phone,
              poste: admin.poste,
              idFiliale: admin.idFiliale,
              nomFiliale: admin.nomFiliale,
              role: typeof admin.role === 'string' ? { id: uuidv4(), name: admin.role, normalizedName: admin.role.toUpperCase() } : admin.role,
              UserRoles: admin.UserRoles
            } as User));
            this.filteredAdmins = [...this.admins];
            this.totalItems = this.filteredAdmins.length;
            this.updatePaginatedAdmins();
          } else {
            console.error('response.data is not an array:', response.data);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Les données des administrateurs ne sont pas valides.',
            });
            this.admins = [];
            this.filteredAdmins = [];
            this.totalItems = 0;
            this.updatePaginatedAdmins();
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: response.message,
          });
          this.admins = [];
          this.filteredAdmins = [];
          this.totalItems = 0;
          this.updatePaginatedAdmins();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des administrateurs', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Erreur lors du chargement des administrateurs.',
        });
        this.admins = [];
        this.filteredAdmins = [];
        this.totalItems = 0;
        this.updatePaginatedAdmins();
        this.loading = false;
      }
    });
  }

  deleteAdmin(id: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cet administrateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.admins = this.admins.filter(a => a.id !== id);
            this.filteredAdmins = this.filteredAdmins.filter(a => a.id !== id);
            this.totalItems = this.filteredAdmins.length;
            this.updatePaginatedAdmins();
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Administrateur supprimé avec succès',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur de Suppression',
              text: 'Erreur lors de la suppression de l\'administrateur.',
            });
          }
        });
      }
    });
  }

  search(value: string): void {
    const searchTerm = value ? value.toLowerCase() : '';
    this.filteredAdmins = this.admins.filter(admin => {
      const matchesSearchTerm = !searchTerm ||
        (admin.fullName && admin.fullName.toLowerCase().includes(searchTerm)) ||
        (admin.email && admin.email.toLowerCase().includes(searchTerm));
      return matchesSearchTerm;
    });

    this.totalItems = this.filteredAdmins.length;
    this.currentPage = 0;
    this.updatePaginatedAdmins();
  }

  updatePaginatedAdmins(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredAdmins.length);
    this.paginatedAdmins = this.filteredAdmins.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedAdmins();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}