import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService} from '../../shared/services/user.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-recruiter-details',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, SidebarComponent,RouterModule],
  templateUrl: './recruiter-details.component.html',
  styleUrls: ['./recruiter-details.component.css']
})
export class RecruiterDetailsComponent implements OnInit {
  recruiter: User | null = null;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const recruiterId = this.route.snapshot.paramMap.get('id');
    if (recruiterId) {
      this.loadRecruiterDetails(recruiterId);
    } else {
      this.snackBar.open('ID du recruteur non fourni.', 'Fermer', { duration: 3000 });
      this.router.navigate(['/recruiter']);
    }
  }

  loadRecruiterDetails(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.recruiter = response.data ? response.data : response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.snackBar.open('Erreur lors du chargement des détails du recruteur.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/recruiter']);
        this.loading = false;
      }
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