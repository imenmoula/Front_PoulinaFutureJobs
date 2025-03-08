import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Filiale } from '../../../Models/filiale.model';
import { FilialeService } from '../../shared/services/filiale.service';

@Component({
  selector: 'app-filiale-list',
  templateUrl: './filiale-list.component.html',
  styleUrls: ['./filiale-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FilialeListComponent implements OnInit {
  filiales: Filiale[] = [];
  isLoading = false; // Initialisé à false, activé uniquement pendant le chargement
  errorMessage: string | null = null;

  constructor(public filialeService: FilialeService) {}

  ngOnInit(): void {
    console.log('FilialeListComponent initialized');
    this.loadFiliales();
  }

  loadFiliales(): void {
    console.log('Loading filiales...');

    this.isLoading = true;
    this.errorMessage = null;

    this.filialeService.getFiliales().subscribe({
      next: (data) => {
        this.filiales = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading filiales:', err);
        this.errorMessage = `Erreur lors du chargement des filiales : ${err.message || 'Erreur inconnue'}`;
        this.isLoading = false;
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filiale ?')) {
      this.filialeService.deleteFiliale(id).subscribe({
        next: () => {
          // Mise à jour locale au lieu de recharger toute la liste
          this.filiales = this.filiales.filter(f => f.idFiliale !== id);
          this.errorMessage = null;
        },
        error: (err: any) => {
          this.errorMessage = `Erreur lors de la suppression : ${err.message || 'Erreur inconnue'}`;
        }
      });
    }
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }
}