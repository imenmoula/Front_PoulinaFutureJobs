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
  selector: 'app-candidate-list',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, SidebarComponent, ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './candidate-list.component.html',
  styles: ``
})
export class CandidateListComponent implements OnInit {
  candidates: User[] = [];
  filteredCandidates: User[] = [];
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
      searchTerm: ['']
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
          this.candidates = response.data;
          this.filteredCandidates = this.candidates;
        } else {
          this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidats', error);
        this.snackBar.open('Erreur lors du chargement des candidats.', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteCandidate(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce candidat ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getCandidates();
          this.snackBar.open('Candidat supprimé avec succès !', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  search(value: string): void {
    if (!value) {
      this.filteredCandidates = [...this.candidates];
      return;
    }

    const lowerCaseValue = value.toLowerCase();
    this.filteredCandidates = this.candidates.filter(candidate =>
      (candidate.fullName && candidate.fullName.toLowerCase().includes(lowerCaseValue)) ||
      (candidate.email && candidate.email.toLowerCase().includes(lowerCaseValue))
    );
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