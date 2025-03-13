import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Departement } from '../../Models/departement';
import { DepartementService } from '../../shared/services/departement.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-list',
  standalone: true,
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ReactiveFormsModule // Replace FormsModule with ReactiveFormsModule
  ]
})
export class DepartmentListComponent implements OnInit {
  departements: Departement[] = [];
  filteredDepartements: Departement[] = [];
  sidebarOpen: boolean = false;
  searchForm: FormGroup;
  successMessage: string | null = null;
  errorMessages: string[] = [];

  constructor(
    private departementService: DepartementService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadDepartements();

    // Listen to changes in the search input
    this.searchForm.get('searchTerm')?.valueChanges.subscribe((value) => {
      this.filterDepartements(value);
    });
  }

  // Load all departments
  loadDepartements(): void {
    this.departementService.getDepartements().subscribe({
      next: (departements) => {
        this.departements = departements;
        this.filteredDepartements = departements; // Initially show all departments
      },
      error: (error) => {
        this.showError(['Échec du chargement des départements : ' + error.message]);
      }
    });
  }

  filterDepartements(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredDepartements = [...this.departements]; // Reset to full list
    } else {
      this.filteredDepartements = this.departements.filter(departement =>
        departement.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  
 

  deleteDepartement(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce département ?')) {
      this.departementService.deleteDepartement(id).subscribe({
        next: () => {
          this.departements = this.departements.filter(d => d.idDepartement !== id);
          this.filteredDepartements = this.filteredDepartements.filter(d => d.idDepartement !== id);
          this.showSuccess('Département supprimé avec succès');
        },
        error: (error) => {
          this.showError(['Échec de la suppression du département : ' + error.message]);
        }
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessages = [];
    setTimeout(() => {
      this.successMessage = null;
    }, 5000); // Clear after 5 seconds
  }

  private showError(messages: string[]): void {
    this.successMessage = null;
    this.errorMessages = messages;
    setTimeout(() => {
      this.errorMessages = [];
    }, 5000); // Clear after 5 seconds
  }
}