import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center">
      <div class="page-count">
        {{ getPageInfo() }}
      </div>
      <ul class="pagination">
        <li class="page-item" [class.disabled]="currentPage === 0">
          <a class="page-link" href="javascript:void(0)" (click)="onPrevious()">
            <i class="fa fa-chevron-left"></i>
          </a>
        </li>
        
        <li 
          *ngFor="let page of getPages()" 
          class="page-item" 
          [class.active]="page - 1 === currentPage"
        >
          <a 
            class="page-link" 
            href="javascript:void(0)" 
            (click)="changePage(page - 1)"
          >
            {{ page }}
          </a>
        </li>
        
        <li class="page-item" [class.disabled]="currentPage >= totalPages - 1">
          <a class="page-link" href="javascript:void(0)" (click)="onNext()">
            <i class="fa fa-chevron-right"></i>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .page-item {
      margin: 0 2px;
    }
    .page-link {
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      color: #6366f1;
      min-width: 32px;
      height: 32px;
      padding: 5px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .page-item.active .page-link {
      background-color: #6366f1;
      border-color: #6366f1;
      color: white;
    }
    .page-item.disabled .page-link {
      color: #9ca3af;
      background-color: #fff;
      border-color: #e0e0e0;
      pointer-events: none;
    }
    .page-link:hover {
      background-color: #f3f4f6;
      color: #4f46e5;
    }
  `]
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getPages(): number[] {
    const visiblePages = 5;
    let startPage = Math.max(1, this.currentPage + 1 - Math.floor(visiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + visiblePages - 1);
    
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPrevious(): void {
    if (this.currentPage > 0) {
      this.changePage(this.currentPage - 1);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.changePage(this.currentPage + 1);
    }
  }

  getPageInfo(): string {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
    return `${start}-${end} sur ${this.totalItems} éléments`;
  }
}