import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../shared/services/offre-emploi.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../Models/filiale.model';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-offre-detail',
  standalone: true,
  imports: [CommonModule,FooterComponent,HeaderComponent,SidebarComponent],
  templateUrl: './offre-detail.component.html',
})
export class OffreDetailComponent implements OnInit {
  idOffre?: string;
  offreDetails: any = null; // Stocke les détails de l’offre
  filiales: Filiale[] = []; // Pour afficher le nom de la filiale
  sidebarOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.idOffre = this.route.snapshot.paramMap.get('id')!;
    if (this.idOffre) {
      this.loadOffreDetails();
    }

    // Charger les filiales pour associer l’idFiliale au nom
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales;
        console.log('Filiales loaded:', this.filiales);
      },
      error: (err) => {
        console.error('Error fetching filiales:', err);
      }
    });
  }

  loadOffreDetails() {
    this.offreService.getOffreById(this.idOffre!).subscribe({
      next: (data) => {
        this.offreDetails = data;
        console.log('Offre details loaded:', this.offreDetails);
      },
      error: (err) => {
        console.error('Error fetching offre:', err);
      }
    });
  }

  
  getTypeContratLabel(value: number | undefined): string {
    if (value === undefined) return 'Non spécifié';
    switch (value) {
      case 1: return 'CDI';
      case 2: return 'CDD';
      case 3: return 'Freelance';
      case 4: return 'Stage';
      default: return 'Inconnu';
    }
  }

  getStatutLabel(value: number | undefined): string {
    if (value === undefined) return 'Non spécifié';
    switch (value) {
      case 0: return 'Ouvert';
      case 1: return 'Fermé';
      default: return 'Inconnu';
    }
  }

  getModeTravailLabel(value: number | undefined): string {
    if (value === undefined) return 'Non spécifié';
    switch (value) {
      case 0: return 'Présentiel';
      case 1: return 'Hybride';
      case 2: return 'Télétravail';
      default: return 'Inconnu';
    }
  }

  getFilialeName(idFiliale: string | undefined): string {
    if (!idFiliale) return 'Non spécifiée';
    const filiale = this.filiales.find(f => f.idFiliale === idFiliale);
    return filiale ? filiale.nom : 'Non spécifiée';
  }

  getFilialeAdresse(idFiliale: string | undefined): string {
    if (!idFiliale) return 'Non spécifiée';
    const filiale = this.filiales.find(f => f.idFiliale === idFiliale);
    return filiale ? filiale.adresse : 'Non spécifiée';
  }

  goBack() {
    this.router.navigate(['/offres']); // Remplace '/liste-offres' par la route de ta liste d'offres
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}