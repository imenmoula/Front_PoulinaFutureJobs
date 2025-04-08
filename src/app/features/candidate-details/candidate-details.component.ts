import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService} from '../../shared/services/user.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, SidebarComponent],
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  candidate: User | null = null;
  sidebarOpen: boolean = false;
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const candidateId = this.route.snapshot.paramMap.get('id');
    if (candidateId) {
      this.loadCandidateDetails(candidateId);
    } else {
      this.snackBar.open('ID du candidat non fourni.', 'Fermer', { duration: 3000 });
      this.router.navigate(['/candidate']);
    }
  }

  loadCandidateDetails(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.candidate = response.data ? response.data : response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.snackBar.open('Erreur lors du chargement des détails du candidat.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/candidate']);
        this.loading = false;
      }
    });
  }
onCancle() {
  this.router.navigate(['/candidate']);
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
  onCancel(): void {
    this.router.navigate([`/candidates`]);
  }
}