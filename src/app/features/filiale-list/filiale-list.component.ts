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

@Component({
  selector: 'app-filiale-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
    SidebarComponent
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
  sidebarOpen: boolean = false;
  searchForm: FormGroup;
  successMessage: string | null = null;
  errorMessages: string[] = [];

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
      console.log('Search term entered:', value);
      this.searchFiliales(value);
    });
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => {
        this.filiales = filiales || [];
        this.filteredFiliales = [...this.filiales];
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showError(['Échec du chargement des filiales : ' + error.message]);
        this.filteredFiliales = [];
      }
    });
  }

  searchFiliales(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredFiliales = [...this.filiales];
      this.cdr.detectChanges();
      return;
    }
    
    // Utiliser la méthode correcte du service
    this.filialeService.searchFilialesByName(searchTerm).subscribe({
      next: (filiales) => {
        this.filteredFiliales = filiales || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showError(['Échec de la recherche des filiales : ' + error.message]);
        this.filteredFiliales = [];
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cette filiale ?')) {
      this.filialeService.deleteFiliale(id).subscribe({
        next: () => {
          this.filiales = this.filiales.filter(f => f.idFiliale !== id);
          this.filteredFiliales = this.filteredFiliales.filter(f => f.idFiliale !== id);
          this.showSuccess('Filiale supprimée avec succès');
        },
        error: (error) => {
          this.showError(['Échec de la suppression de la filiale : ' + error.message]);
        }
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/default-image.png';
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessages = [];
    setTimeout(() => this.successMessage = null, 5000);
  }

  private showError(messages: string[]): void {
    this.successMessage = null;
    this.errorMessages = messages;
    setTimeout(() => this.errorMessages = [], 5000);
  }
}