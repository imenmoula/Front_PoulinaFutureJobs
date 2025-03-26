import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    NgxDatatableModule,
    PaginationComponent // Ajouter le composant de pagination
  ],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  rows: Role[] = [];
  originalRows: Role[] = [];
  paginatedRows: Role[] = []; // Nouvelle propriété pour les lignes paginées
  sidebarOpen: boolean = false;
  searchTerm: string = '';
  
  pageSize = 2; // Ajustez la taille de page selon vos besoins
  currentPage = 0;
  totalItems = 0;

  columns = [
    { name: 'ID#', prop: 'index', flexGrow: 0.5, minWidth: 60 },
    { name: 'Nom', prop: 'name', flexGrow: 2, minWidth: 150 },
    { name: 'Actions', prop: 'actions', flexGrow: 1, minWidth: 150 }
  ];
  
  constructor(
    private roleService: RoleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.originalRows = data.map((role, index) => ({
          ...role,
          name: role.name,
          normalizedName: role.normalizedName,
          index: index + 1
        }));
        this.rows = [...this.originalRows];
        this.totalItems = this.rows.length;
        this.updatePaginatedRows(); // Mettre à jour les lignes paginées
      },
      error: (err) => {
        this.showErrorMessage('Impossible de charger les rôles. Veuillez réessayer.');
        console.error('Error loading roles:', err);
      }
    });
  }

  updatePaginatedRows(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedRows = this.rows.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedRows();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  deleteRole(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.loadRoles();
          this.showSuccessMessage('Rôle supprimé avec succès !');
        },
        error: (err) => {
          this.showErrorMessage('Erreur lors de la suppression du rôle.');
          console.error('Error deleting role:', err);
        }
      });
    }
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  filterRows(searchTerm: string): void {
    if (!searchTerm) {
      this.rows = [...this.originalRows];
    } else {
      this.rows = this.originalRows.filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.rows.length;
    this.currentPage = 0;
    this.updatePaginatedRows();
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.filterRows(this.searchTerm);
  }
}