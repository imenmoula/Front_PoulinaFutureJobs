import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import { Filiale } from '../../Models/filiale.model';
import { environment } from '../../../environments/environment.development';
import { CandidateFooterComponent } from '../../CandidateFront/components/candidate-footer/candidate-footer.component';
import { CandidateHeaderComponent } from '../../CandidateFront/components/candidate-header/candidate-header.component';

@Component({
  selector: 'app-candidate-only',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  
  ],
  templateUrl: './candidate-only.component.html',
  styleUrls: [
    '../../../assets/User/css/bootstrap.min.css',
    '../../../assets/User/css/owl.carousel.min.css',
    '../../../assets/User/css/flaticon.css',
    '../../../assets/User/css/price_rangs.css',
    '../../../assets/User/css/slicknav.css',
    '../../../assets/User/css/animate.min.css',
    '../../../assets/User/css/magnific-popup.css',
    '../../../assets/User/css/fontawesome-all.min.css',
    '../../../assets/User/css/themify-icons.css',
    '../../../assets/User/css/slick.css',
    '../../../assets/User/css/nice-select.css',
    '../../../assets/User/css/style.css',
    './candidate-only.component.css'
  ]
})
export class CandidateOnlyComponent implements OnInit {
  fullName: string = '';
  filiales: Filiale[] = [];
  offres: OffreEmploi[] = [];
  searchTerm: string = '';

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private filialeService: FilialeService,
    private offreEmploiService: OffreEmploiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/signin');
      return;
    }
    this.fullName = this.authService.getUserFullName();

    // Load filiales
    this.filialeService.getFiliales().subscribe({
      next: (data) => {
        console.log('Filiales fetched:', data);
        this.filiales = data;
      },
      error: (err) => {
        console.error('Error fetching filiales:', err);
      }
    });

    // Load offres
    this.loadOffres();
  }

  loadOffres(): void {
    this.offreEmploiService.getAllOffres().subscribe({
      next: (offres) => {
        console.log('Offres fetched:', offres);
        this.offres = offres;
        // Ensure each offre has filiale data
        this.offres.forEach((offre) => {
          if (!offre.filiale && offre.idFiliale) {
            this.filialeService.getFiliale(offre.idFiliale).subscribe({
              next: (filiale) => {
                offre.filiale = filiale;
              },
              error: (err) => {
                console.error(`Error fetching filiale for offre ${offre.idOffreEmploi}:`, err);
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error fetching offres:', err);
      }
    });
  }

  getFeaturedJobs(offres: OffreEmploi[]): OffreEmploi[] {
    const sortedOffres = [...offres].sort((a, b) => {
      const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0;
      const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0;
      return dateB - dateA;
    });
    return sortedOffres.slice(0, 4);
  }

  get filteredOffres(): OffreEmploi[] {
    if (!this.searchTerm) {
      return this.getFeaturedJobs(this.offres);
    }
    const term = this.searchTerm.toLowerCase();
    return this.offres.filter(offre =>
      (offre.titre?.toLowerCase().includes(term) || false) ||
      (offre.description?.toLowerCase().includes(term) || false) ||
      (offre.filiale?.nom?.toLowerCase().includes(term) || false)
    );
  }

  timeSince(date: any): string {
    if (!date) return 'Inconnu';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
    interval = seconds / 2592000;
    if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
    interval = seconds / 86400;
    if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
    interval = seconds / 3600;
    if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
    interval = seconds / 60;
    if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
    return `il y a ${Math.floor(seconds)} secondes`;
  }

  formatDate(date: any): string {
    if (!date) return 'Date inconnue';
    try {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de format de date:', error);
      return 'Date inconnue';
    }
  }

  getImageUrl(photo: string | undefined): string {
    if (!photo) return '../../../assets/User/img/default-filiale.jpg';
    return photo.startsWith('http') ? photo : `${environment.apiBaseUrl}/Uploads/${photo}`;
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }
}