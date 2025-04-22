import { Component, OnInit } from '@angular/core';
import { CandidateurSharedService } from '../../shared/services/candidateur-shared.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './candidature-list.component.html',
  styles: ``
})
export class CandidatureListComponent  implements OnInit {
  candidatures: any[] = [];
  isLoading = true;
  error = '';
  userId!: string;

  constructor(
    private candidatureService: CandidateurSharedService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser['id']; // Assuming 'id' is the string property in TokenPayload
    } else {
      this.error = 'Utilisateur non connecté';
      console.error('Erreur: utilisateur non connecté');
    }
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.isLoading = true;
    this.candidatureService.getAllCandidatures()
      .subscribe(
        candidatures => {
          // Filtrer uniquement les candidatures de l'utilisateur connecté
          this.candidatures = candidatures.filter(c => c.appUserId === this.userId);
          this.isLoading = false;
        },
        error => {
          this.error = 'Erreur lors du chargement des candidatures';
          this.isLoading = false;
          console.error(error);
        }
      );
  }
}
