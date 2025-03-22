import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav *ngIf="totalPages > 1" class="d-flex justify-content-center mt-3">
      <ul class="pagination">
        <!-- Bouton Précédent -->
        <li class="page-item" [class.disabled]="currentPage === 1">
          <a class="page-link" (click)="previousPage()">&lt;</a>
        </li>

        <!-- Numéros de pages -->
        <li class="page-item" *ngFor="let page of getPages()" [class.active]="page === currentPage">
          <a class="page-link" (click)="goToPage(page)">{{ page }}</a>
        </li>

        <!-- Bouton Suivant -->
        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <a class="page-link" (click)="nextPage()">&gt;</a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .pagination {
      display: flex;
      gap: 2px; /* Réduit l'espacement entre les éléments */
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .page-item .page-link {
      border-radius: 4px;
      border: 1px solid #d1d5db; /* Bordure grise claire */
      color: #3b82f6; /* Texte bleu */
      min-width: 32px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      background-color: white;
    }

    .page-item:not(.disabled) .page-link:hover {
      background-color: #f3f4f6; /* Fond gris clair au survol */
      color: #2563eb; /* Bleu plus foncé au survol */
    }

    .page-item.active .page-link {
      background-color: #3b82f6; /* Fond bleu pour la page active */
      border-color: #3b82f6;
      color: white;
    }

    .page-item.disabled .page-link {
      color: #9ca3af; /* Texte gris pour les boutons désactivés */
      background-color: white;
      cursor: not-allowed;
    }
  `]
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 5;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getPages(): number[] {
    const maxVisiblePages = 5; // Nombre maximum de pages visibles
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}