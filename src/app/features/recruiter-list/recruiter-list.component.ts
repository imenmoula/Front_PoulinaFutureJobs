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

@Component({
  selector: 'app-recruiter-list',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, SidebarComponent, ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './recruiter-list.component.html',
  styles: ``
})
export class RecruiterListComponent implements OnInit {
  recruiters: User[] = [];
  filteredRecruiters: User[] = [];
  searchForm: FormGroup;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      ville: ['']
    });
  }

  ngOnInit(): void {
    this.getRecruiters();
    this.searchForm.valueChanges.subscribe(value => this.applyFilters(value));
  }

  getRecruiters(): void {
    this.loading = true;
    this.userService.getUsersByRole('Recruteur').subscribe({
      next: (response) => {
        if (response.success) {
          this.recruiters = response.data;
          this.filteredRecruiters = this.recruiters;
        } else {
          this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des recruteurs', error);
        this.snackBar.open('Erreur lors du chargement des recruteurs.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteRecruiter(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce recruteur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getRecruiters();
          this.showSnackbar('Recruteur supprimé avec succès !', 'Fermer');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.showSnackbar('Erreur lors de la suppression.', 'Fermer');
        }
      });
    }
  }

  applyFilters(value: { searchTerm: string, ville: string }): void {
    const searchTerm = value.searchTerm ? value.searchTerm.toLowerCase() : '';
    const ville = value.ville ? value.ville.toLowerCase() : '';

    this.filteredRecruiters = this.recruiters.filter(recruiter => {
      const matchesSearchTerm = !searchTerm ||
        (recruiter.fullName && recruiter.fullName.toLowerCase().includes(searchTerm)) ||
        (recruiter.email && recruiter.email.toLowerCase().includes(searchTerm));

      const matchesVille = !ville ||
        (recruiter.ville && recruiter.ville.toLowerCase().includes(ville));

      return matchesSearchTerm && matchesVille;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  showSnackbar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}