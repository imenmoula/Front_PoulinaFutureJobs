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
  selector: 'app-admin-list',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, SidebarComponent, ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-list.component.html',
  styles: ``
})
export class AdminListComponent implements OnInit {
  admins: User[] = [];
  filteredAdmins: User[] = [];
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
    this.getAdmins();
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => this.search(value));
  }

  getAdmins(): void {
    this.loading = true;
    this.userService.getUsersByRole('Admin').subscribe({
      next: (response) => {
        if (response.success) {
          this.admins = response.data; // Charger uniquement les utilisateurs avec le rôle "Admin"
          this.filteredAdmins = this.admins;
        } else {
          this.snackBar.open(response.message, 'Fermer', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des admins', error);
        this.snackBar.open('Erreur lors du chargement des administrateurs.', 'Fermer', { duration: 3000 });
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
    if (!value) {
      this.filteredAdmins = [...this.admins];
      return;
    }

    const lowerCaseValue = value.toLowerCase();
    this.filteredAdmins = this.admins.filter(admin =>
      (admin.fullName && admin.fullName.toLowerCase().includes(lowerCaseValue)) ||
      (admin.email && admin.email.toLowerCase().includes(lowerCaseValue))
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