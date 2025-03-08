import { AuthService } from './../../shared/services/auth.service';
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { Filiale } from '../../../Models/filiale.model';
// import { FilialeService } from '../../shared/services/filiale.service';

// @Component({
//   selector: 'app-filiale-list',
//   templateUrl: './filiale-list.component.html',
//   styleUrls: ['./filiale-list.component.css'],
//   standalone: true,
//   imports: [CommonModule, RouterModule]
// })
// export class FilialeListComponent implements OnInit {
//   filiales: Filiale[] = [];
//   isLoading = false;
//   errorMessage: string | null = null;

//   constructor(private filialeService: FilialeService) {}

//   ngOnInit(): void {
//     this.loadFiliales();
//   }

//   loadFiliales(): void {
//     this.isLoading = true;
//     this.errorMessage = null;

//     this.filialeService.getFiliales().subscribe({
//       next: (data) => {
//         this.filiales = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.errorMessage = `Erreur lors du chargement des filiales : ${err.message}`;
//         this.isLoading = false;
//       }
//     });
//   }

//   onDelete(id: string): void {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cette filiale ?')) {
//       this.filialeService.deleteFiliale(id).subscribe({
//         next: () => {
//           this.filiales = this.filiales.filter(f => f.idFiliale !== id);
//           this.errorMessage = null;
//         },
//         error: (err) => {
//           this.errorMessage = `Erreur lors de la suppression : ${err.message}`;
//         }
//       });
//     }
//   }
// }

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
  filiales: any[] = []; 
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.loadFiliales();
  }

  loadFiliales(): void {
    this.isLoading = true;
    this.filialeService.getFiliales().subscribe({
      next: (data) => {
        this.filiales = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erreur : ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  onDelete(id: string): void {
    if (!id) return;
    
    if (confirm('Voulez-vous vraiment supprimer cette filiale ? Cette action est irréversible.')) {
      this.filialeService.deleteFiliale(id).subscribe({
        next: () => {
          this.filiales = this.filiales.filter(f => f.idFiliale !== id);
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = `Erreur de suppression : ${err.message}`;
        }
      });
    }
  }

  isAdmin(): boolean {
    return true;
  }
}
