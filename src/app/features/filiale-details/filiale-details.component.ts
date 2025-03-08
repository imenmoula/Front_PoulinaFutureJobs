import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Filiale } from '../../../Models/filiale.model';
import { FilialeService } from '../../shared/services/filiale.service';
import { ActivatedRoute } from '@angular/router';

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
    public filialeService: FilialeService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFiliale(id);
    } else {
      this.errorMessage = 'ID de la filiale non trouvé dans l\'URL.';
    }
  }

  loadFiliale(id: string): void {
    this.filialeService.getFiliale(id).subscribe({
      next: (data) => {
        this.filiale = data;
        this.errorMessage = null; // Effacer l'erreur si les données sont récupérées correctement
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du chargement des détails de la filiale : ${err.message}`;
        this.filiale = null; // Assurez-vous que les données de la filiale ne restent pas dans le cas d'une erreur
      }
    });
  }
}
