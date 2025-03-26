
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/user.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { v4 as uuidv4 } from 'uuid';

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
    PaginationComponent // Added for pagination
  ],
  templateUrl: './admin-list.component.html',
  styleUrls: [`./admin-list.component.css`]
})
export class AdminListComponent implements OnInit {
  admins: User[] = [];
  filteredAdmins: User[] = [];
  paginatedAdmins: User[] = []; // Added for pagination
  searchForm: FormGroup;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  pageSize = 3; // Same as recruiter list
  currentPage = 0; // Added for pagination
  totalItems = 0; // Added for pagination

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
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
              fullName: admin.fullName || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'N/A',
              nom: admin.lastName || admin.nom || 'N/A',
              prenom: admin.firstName || admin.prenom || 'N/A',
              photo: admin.photo,
              PhoneNumber: admin.phone,
              entreprise: admin.entreprise,
              poste: admin.poste,
              role: typeof admin.role === 'string' ? { id: uuidv4(), name: admin.role, normalizedName: admin.role.toUpperCase() } : admin.role,
              UserRoles: admin.UserRoles
            } as User));
            this.filteredAdmins = [...this.admins];
            this.totalItems = this.filteredAdmins.length;
            this.updatePaginatedAdmins();
          } else {
            console.error('response.data is not an array:', response.data);
            this.snackBar.open('Les données des administrateurs ne sont pas valides.', 'Fermer', { duration: 3000 });
            this.admins = [];
            this.filteredAdmins = [];
            this.totalItems = 0;
            this.updatePaginatedAdmins();
          }
        } else {
          this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
          this.admins = [];
          this.filteredAdmins = [];
          this.totalItems = 0;
          this.updatePaginatedAdmins();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des administrateurs', error);
        this.snackBar.open('Erreur lors du chargement des administrateurs.', 'Fermer', { duration: 3000 });
        this.admins = [];
        this.filteredAdmins = [];
        this.totalItems = 0;
        this.updatePaginatedAdmins();
        this.loading = false;
      }
    });
  }

  deleteAdmin(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cet administrateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getAdmins();
          this.showSnackbar('Administrateur supprimé avec succès !', 'Fermer');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.showSnackbar('Erreur lors de la suppression.', 'Fermer');
        }
      });
    }
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
    this.currentPage = 0; // Reset to first page on search
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

  showSnackbar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom', // Match recruiter list
      horizontalPosition: 'center' // Match recruiter list
    });
  }
}