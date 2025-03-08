import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FilialeService } from '../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';

@Component({
  selector: 'app-filiale-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './filiale-details.component.html',
  styleUrls: ['./filiale-details.component.css']
})
export class FilialeDetailsComponent implements OnInit {
  filiale: Filiale | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private filialeService: FilialeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFilialeDetails(id);
    } else {
      this.errorMessage = 'ID de filiale non fourni.';
      this.isLoading = false;
    }
  }
  loadFilialeDetails(id: string): void {
    this.filialeService.getFilialeById(id).subscribe({
      next: (filiale: Filiale) => {
        this.filiale = filiale;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du chargement des détails : ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  // Getter pour vérifier si l'utilisateur est admin
  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }
}