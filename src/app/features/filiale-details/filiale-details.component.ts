import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Filiale } from '../../../Models/filiale.model';
import { FilialeService } from '../../shared/services/filiale.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-filiale-detail',
  templateUrl: './filiale-detail.component.html',
  styleUrls: ['./filiale-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FilialeDetailComponent implements OnInit {
  filiale: Filiale | null = null;
  errorMessage: string | null = null;

  constructor(
    private filialeService: FilialeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFiliale(id);
    } else {
      this.errorMessage = 'ID de la filiale non trouvé dans l\'URL.';
    }
  }

  loadFiliale(id: string): void {
    this.filialeService.getFiliale(id).subscribe({
      next: (response) => {
        // Adjust based on your backend response structure
        // If backend returns { data: Filiale, message: string }
        this.filiale = response; 
        this.errorMessage = null;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Vous n\'êtes pas autorisé à accéder à cette ressource. Veuillez vous reconnecter.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.errorMessage = 'La filiale spécifiée n\'existe pas.';
        } else {
          this.errorMessage = `Erreur lors du chargement des détails de la filiale : ${err.message}`;
          console.error('Error loading filiale:', err); // Log for debugging
        }
        this.filiale = null;
      }
    });
  }
}