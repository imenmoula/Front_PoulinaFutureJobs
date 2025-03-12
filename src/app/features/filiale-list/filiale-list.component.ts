import { SidebarComponent } from './../../layoutBackend/sidebar/sidebar.component';
import { Component, OnInit } from '@angular/core';
import { FilialeService } from '../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { ContentComponent } from '../../layoutBackend/content/content.component';
import { Filiale } from '../../Models/filiale.model';

@Component({
  selector: 'app-filiale-list',
  templateUrl: './filiale-list.component.html',
  styleUrls: ['./filiale-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, HeaderComponent, SidebarComponent]
})

export class FilialeListComponent implements OnInit {
  filiales: Filiale[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  sidebarOpen: boolean = false;

  constructor(private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.loadFiliales();
  }

  loadFiliales(): void {
    this.isLoading = true;
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales.map(filiale => ({
          ...filiale,
          photo: filiale.photo
            ? filiale.photo.startsWith('http')
              ? filiale.photo
              : `http://localhost:5006${filiale.photo}` // Ajoute la base URL si nécessaire
            : ''
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des filiales : ' + error.message;
        this.isLoading = false;
      }
    });
  }

  onDelete(idFiliale: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filiale ?')) {
      this.filialeService.deleteFiliale(idFiliale).subscribe({
        next: () => {
          this.filiales = this.filiales.filter(f => f.idFiliale !== idFiliale);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression : ' + error.message;
        }
      });
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none'; // Masquer l'image en cas d'erreur
    console.error('Erreur de chargement de l\'image pour l\'URL :', imgElement.src);
    this.errorMessage = 'Erreur lors du chargement d\'une image. Vérifiez l\'URL ou l\'authentification.';
  }

  isAdmin(): boolean {
    return true;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen; // Méthode pour basculer
  }
}