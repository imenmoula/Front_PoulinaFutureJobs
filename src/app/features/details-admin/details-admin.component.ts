import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-details-admin',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, SidebarComponent, FormsModule, RouterModule, RouterLink],
  templateUrl: './details-admin.component.html',
  styles: '',
})
export class DetailsAdminComponent implements OnInit {
  admin: User | null = null;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const adminId = this.route.snapshot.paramMap.get('id');
    if (adminId) {
      this.loadAdminDetails(adminId);
    } else {
      this.snackBar.open('ID de l\'administrateur non fourni.', 'Fermer', { duration: 3000 });
      this.router.navigate(['/admin']);
    }
  }

  loadAdminDetails(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.admin = response.data ? response.data : response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.snackBar.open('Erreur lors du chargement des détails de l\'administrateur.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/admin']);
        this.loading = false;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}