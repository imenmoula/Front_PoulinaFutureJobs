import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Filiale } from '../../../Models/filiale.model';
import { FilialeService } from '../../shared/services/filiale.service';

@Component({
  selector: 'app-filiale-list',
  templateUrl: './filiale-list.component.html',
  styleUrls: [''],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FilialeListComponent implements OnInit {
  filiales: Filiale[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.loadFiliales();
  }

  loadFiliales(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.filialeService.getFiliales().subscribe(
      (data) => {
        this.filiales = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Une erreur est survenue lors du chargement des filiales.';
        this.isLoading = false;
      }
    );
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filiale ?')) {
      this.filialeService.deleteFiliale(id).subscribe(
        () => {
          this.loadFiliales();
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