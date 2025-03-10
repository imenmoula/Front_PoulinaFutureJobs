import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-filiale-detail',
  templateUrl: './filiale-details.component.html',
  styleUrls: ['./filiale-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule,FooterComponent,HeaderComponent,SidebarComponent]
})
export class FilialeDetailsComponent implements OnInit {
  filiale: Filiale | null = null;
  errorMessage: string | null = null;
  sidebarOpen: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filialeService: FilialeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFiliale(id);
    } else {
      this.errorMessage = 'ID de la filiale non fourni.';
    }
  }

  loadFiliale(id: string): void {
    this.filialeService.getFiliale(id).subscribe({
      next: (filiale) => {
        this.filiale = {
          ...filiale,
          photo: filiale.photo
            ? filiale.photo.startsWith('http')
              ? filiale.photo
              : `http://localhost:5006${filiale.photo}`
            : ''
        };
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails de la filiale : ' + error.message;
      }
    });
  }

  onDelete(idFiliale: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filiale ?')) {
      this.filialeService.deleteFiliale(idFiliale).subscribe({
        next: () => {
          this.router.navigate(['/admin/filiales']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression : ' + error.message;
        }
      });
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    console.error('Erreur de chargement de l\'image pour l\'URL :', imgElement.src);
    this.errorMessage = 'Erreur lors du chargement de l\'image. Vérifiez l\'URL.';
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen; // Méthode pour basculer
  }
}