import { Component, OnInit } from '@angular/core';
import { Filiale } from '../../../Models/filiale.model';
import { FilialeService } from '../../shared/services/filiale.service';


@Component({
  standalone: true, // Si applicab
  selector: 'app-filials-list',
  templateUrl: './filials-list.component.html',
  styleUrls: ['./filiales-list.component.css']
})
export class FilialesListComponent implements OnInit {
  filiales: Filiale[] = [];
  isLoading = true; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur

  constructor(private filialeService: FilialeService) {

  }
  ngOnInit(): void {
    this.loadFiliales();
  }

  loadFiliales(): void {
    this.isLoading = true; // Activer le loading
    this.errorMessage = null; // Réinitialiser le message d'erreur

    this.filialeService.getFiliales().subscribe(
      (data) => {
        this.filiales = data;
        this.isLoading = false; // Désactiver le loading après réussite
      },
      (error) => {
        this.errorMessage = 'Une erreur est survenue lors du chargement des filiales.';
        this.isLoading = false; // Désactiver le loading en cas d'erreur
      }
    );
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filiale ?')) {
      this.filialeService.deleteFiliale(id).subscribe(
        () => {
          this.loadFiliales(); // Rafraîchir la liste après suppression
        },
        (error) => {
          this.errorMessage = 'Une erreur est survenue lors de la suppression de la filiale.';
        }
      );
    }
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }
}