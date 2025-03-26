// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FilialeService } from '../../shared/services/filiale.service';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { FooterComponent } from '../../layoutBackend/footer/footer.component';
// import { HeaderComponent } from '../../layoutBackend/header/header.component';
// import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { Filiale } from '../../Models/filiale.model';

// @Component({
//   selector: 'app-filiale-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     ReactiveFormsModule,
//     FooterComponent,
//     HeaderComponent,
//     SidebarComponent
//   ],
//   templateUrl: './filiale-list.component.html',
//   styles: [`
//     .card-header { background-color: #f8f9fa; }
//     .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
//     .sharp { border-radius: 0; }
//     .mr-1 { margin-right: 0.25rem; }
//   `]
// })
// export class FilialeListComponent implements OnInit {
//   filiales: Filiale[] = [];
//   filteredFiliales: Filiale[] = [];
//   sidebarOpen: boolean = false;
//   searchForm: FormGroup;
//   successMessage: string | null = null;
//   errorMessages: string[] = [];

//   constructor(
//     private filialeService: FilialeService,
//     private fb: FormBuilder,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.searchForm = this.fb.group({
//       searchTerm: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.loadFiliales();
//     this.searchForm.get('searchTerm')?.valueChanges.pipe(
//       debounceTime(300),
//       distinctUntilChanged()
//     ).subscribe((value) => {
//       console.log('Search term entered:', value);
//       this.searchFiliales(value);
//     });
//   }

//   loadFiliales(): void {
//     this.filialeService.getFiliales().subscribe({
//       next: (filiales) => {
//         this.filiales = filiales || [];
//         this.filteredFiliales = [...this.filiales];
//         this.cdr.detectChanges();
//       },
//       error: (error) => {
//         this.showError(['Échec du chargement des filiales : ' + error.message]);
//         this.filteredFiliales = [];
//       }
//     });
//   }

//   searchFiliales(searchTerm: string): void {
//     if (!searchTerm.trim()) {
//       this.filteredFiliales = [...this.filiales];
//       this.cdr.detectChanges();
//       return;
//     }
    
//     // Utiliser la méthode correcte du service
//     this.filialeService.searchFilialesByName(searchTerm).subscribe({
//       next: (filiales) => {
//         this.filteredFiliales = filiales || [];
//         this.cdr.detectChanges();
//       },
//       error: (error) => {
//         this.showError(['Échec de la recherche des filiales : ' + error.message]);
//         this.filteredFiliales = [];
//       }
//     });
//   }

//   onDelete(id: string): void {
//     if (confirm('Voulez-vous vraiment supprimer cette filiale ?')) {
//       this.filialeService.deleteFiliale(id).subscribe({
//         next: () => {
//           this.filiales = this.filiales.filter(f => f.idFiliale !== id);
//           this.filteredFiliales = this.filteredFiliales.filter(f => f.idFiliale !== id);
//           this.showSuccess('Filiale supprimée avec succès');
//         },
//         error: (error) => {
//           this.showError(['Échec de la suppression de la filiale : ' + error.message]);
//         }
//       });
//     }
//   }

//   toggleSidebar(): void {
//     this.sidebarOpen = !this.sidebarOpen;
//   }

//   handleImageError(event: Event): void {
//     (event.target as HTMLImageElement).src = 'assets/default-image.png';
//   }

//   private showSuccess(message: string): void {
//     this.successMessage = message;
//     this.errorMessages = [];
//     setTimeout(() => this.successMessage = null, 5000);
//   }

//   private showError(messages: string[]): void {
//     this.successMessage = null;
//     this.errorMessages = messages;
//     setTimeout(() => this.errorMessages = [], 5000);
//   }
// }


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FilialeService } from '../../shared/services/filiale.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Filiale } from '../../Models/filiale.model';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { PaginationComponent } from '../../shared/components/pagination/pagination.component'; // Import PaginationComponent

@Component({
  selector: 'app-filiale-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    PaginationComponent // Added PaginationComponent
  ],
  templateUrl: './filiale-list.component.html',
  styles: [`
    .card-header { background-color: #f8f9fa; }
    .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
    .sharp { border-radius: 0; }
    .mr-1 { margin-right: 0.25rem; }
  `]
})
export class FilialeListComponent implements OnInit {
  filiales: Filiale[] = [];
  filteredFiliales: Filiale[] = [];
  paginatedFiliales: Filiale[] = []; // Added for pagination
  sidebarOpen: boolean = false;
  searchForm: FormGroup;
  pageSize = 3; // Added for pagination, matching DepartmentListComponent
  currentPage = 0; // Added for pagination
  totalItems = 0; // Added for pagination

  constructor(
    private filialeService: FilialeService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadFiliales();
    this.searchForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.searchFiliales(value);
    });
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales || [];
        this.filteredFiliales = [...this.filiales];
        this.totalItems = this.filteredFiliales.length;
        this.updatePaginatedFiliales();
        this.cdr.detectChanges();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: 'Échec du chargement des filiales : ' + error.message,
        });
        this.filteredFiliales = [];
        this.paginatedFiliales = [];
      }
    });
  }

  searchFiliales(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredFiliales = [...this.filiales];
    } else {
      this.filteredFiliales = this.filiales.filter(filiale =>
        filiale.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.filteredFiliales.length;
    this.currentPage = 0; // Reset to first page on filter change
    this.updatePaginatedFiliales();
    this.cdr.detectChanges();
  }

  updatePaginatedFiliales(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredFiliales.length);
    this.paginatedFiliales = this.filteredFiliales.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedFiliales();
  }

  onDelete(id: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cette filiale ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.filialeService.deleteFiliale(id).subscribe({
          next: () => {
            this.filiales = this.filiales.filter(f => f.idFiliale !== id);
            this.filteredFiliales = this.filteredFiliales.filter(f => f.idFiliale !== id);
            this.totalItems = this.filteredFiliales.length;
            this.updatePaginatedFiliales();
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Filiale supprimée avec succès',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur de Suppression',
              text: 'Échec de la suppression de la filiale : ' + error.message,
            });
          }
        });
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/default-image.png';
  }
}