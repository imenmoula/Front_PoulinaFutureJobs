import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    NgxDatatableModule
  ],
  templateUrl: './role-list.component.html',
  styles: [`
    .ngx-datatable {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .datatable-row-even {
      background-color: #f9f9f9;
    }
    .datatable-header {
      background-color: #f8f9fa;
      font-weight: bold;
    }
  `]
})
export class RoleListComponent implements OnInit {
  rows: Role[] = [];
  originalRows: Role[] = []; // Store original data for filtering
  sidebarOpen: boolean = false;
  searchTerm: string = ''; // Add search term property
  
  columns = [
    { name: 'ID#', prop: 'index' },
    { name: 'Nom', prop: 'name' },
    { name: 'Actions', prop: 'actions' }
  ];
  
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;

  constructor(
    private roleService: RoleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((data) => {
      this.originalRows = data.map((role, index) => ({
        ...role,
        index: index + 1
      }));
      this.rows = [...this.originalRows]; // Initialize rows with all data
      this.totalItems = this.rows.length;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  deleteRole(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      this.roleService.deleteRole(id).subscribe(() => {
        this.loadRoles();
        this.showSuccessMessage('Rôle supprimé avec succès !');
      });
    }
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  onPage(event: any): void {
    this.currentPage = event.offset;
  }

  // Add filter method
  filterRows(searchTerm: string): void {
    if (!searchTerm) {
      this.rows = [...this.originalRows]; // Reset to original data if search is empty
    } else {
      this.rows = this.originalRows.filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.rows.length;
    this.currentPage = 0; // Reset to first page after filtering
  }

  // Add method to handle search input changes
  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.filterRows(this.searchTerm);
  }
}