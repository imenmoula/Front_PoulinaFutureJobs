import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-list',

  standalone: true,
  imports: [FooterComponent,HeaderComponent,SidebarComponent,ReactiveFormsModule,CommonModule,FormsModule,RouterLink],
  templateUrl: './admin-list.component.html',
  styles: ``,



})
export class AdminListComponent implements OnInit {
  admins: any[] = [];
  filteredAdmins: any[] = [];
  searchForm: FormGroup;
  sidebarOpen: boolean = false;

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
    this.userService.getUsersByRole('Admin').subscribe(
      response => {
        console.log('Admins loaded:', response);
        this.admins = response.data ? response.data : response; // Gérer les deux cas
        this.filteredAdmins = this.admins;
      },
      error => console.error('Erreur lors du chargement des admins', error)
    );
  }

  deleteAdmin(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cet administrateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getAdmins(); // Rechargez la liste après suppression
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
      this.filteredAdmins = [...this.admins]; // Reset to original list
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