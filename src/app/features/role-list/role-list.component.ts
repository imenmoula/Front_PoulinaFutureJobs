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
    NgxDatatableModule
  ],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  rows: Role[] = [];
  originalRows: Role[] = [];
  sidebarOpen: boolean = false;
  searchTerm: string = '';
  
  pageSize = 2; // Increased page size for better usability
  currentPage = 0;
  totalItems = 0;
  Math = Math; // For use in the template


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
          index: index + 1
        }));
        this.rows = [...this.originalRows];
        this.totalItems = this.rows.length;
      },
      error: (err) => {
        this.showErrorMessage('Impossible de charger les rôles. Veuillez réessayer.');
        console.error('Error loading roles:', err);
      }
    });
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

  onPage(event: any): void {
    this.currentPage = event.offset;
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
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.filterRows(this.searchTerm);
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    const visiblePages = 5; // Number of visible page links
    
    let startPage = Math.max(1, this.currentPage + 1 - Math.floor(visiblePages / 2));
    let endPage = Math.min(pageCount, startPage + visiblePages - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);
  }
}