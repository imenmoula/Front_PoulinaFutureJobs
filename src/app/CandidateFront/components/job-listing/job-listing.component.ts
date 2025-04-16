import { Component, OnInit } from '@angular/core';
import { OffreEmploi } from '../../../Models/offre-emploi.model';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { FilialeService } from '../../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TypeContratEnum } from '../../../Models/enums.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './job-listing.component.html',
  styleUrls: [
    './job-listing.component.css',
    '../../../../assets/User/css/bootstrap.min.css',
    '../../../../assets/User/css/owl.carousel.min.css',
    '../../../../assets/User/css/flaticon.css',
    '../../../../assets/User/css/price_rangs.css',
    '../../../../assets/User/css/slicknav.css',
    '../../../../assets/User/css/animate.min.css',
    '../../../../assets/User/css/magnific-popup.css',
    '../../../../assets/User/css/fontawesome-all.min.css',
    '../../../../assets/User/css/themify-icons.css',
    '../../../../assets/User/css/slick.css',
    '../../../../assets/User/css/nice-select.css',
    '../../../../assets/User/css/style.css'
  ]
})
export class JobListingComponent implements OnInit {
  offres: OffreEmploi[] = [];
  filteredOffres: OffreEmploi[] = [];
  filiales: { [key: string]: Filiale } = {};
  filialesList: Filiale[] = []; // List of filiales for the dropdown
  specialite: string = '';
  typeContrat: string = '';
  modeTravail: string = '';
  selectedFiliale: string = ''; // Selected filiale ID

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private offreService: OffreEmploiService,
    private filialeService: FilialeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffres();
    this.loadFiliales();
  }

  loadOffres(): void {
    this.offreService.getAllOffres().subscribe(
      (data: OffreEmploi[]) => {
        this.offres = data;
        this.filterOffres();
        this.updatePagination();
      },
      (error: any) => {
        console.error('Error loading offers:', error);
      }
    );
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe(
      (data: Filiale[]) => {
        this.filialesList = data; // Store the list for the dropdown
        this.filiales = data.reduce((acc, filiale) => {
          acc[filiale.idFiliale] = filiale;
          return acc;
        }, {} as { [key: string]: Filiale });
      },
      (error: any) => {
        console.error('Error loading filiales:', error);
      }
    );
  }

  filterOffres(): void {
    this.offreService.searchOffres(
      this.specialite,
      '',
      this.typeContrat,
      '',
      this.modeTravail,
      this.selectedFiliale // Pass the selected filiale ID
    ).subscribe(
      (data) => {
        this.filteredOffres = data.offresEmploi || [];
        this.updatePagination();
      },
      (error) => {
        console.error('Error filtering offers:', error);
      }
    );
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page on filter change
    this.filterOffres();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOffres.length / this.itemsPerPage);
  }

  getPaginatedOffres(): OffreEmploi[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOffres.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getContractColor(typeContrat: TypeContratEnum): string {
    switch (typeContrat) {
      case TypeContratEnum.CDI:
        return '#28a745'; // Green
      case TypeContratEnum.CDD:
        return '#007bff'; // Blue
      case TypeContratEnum.Freelance:
        return '#ffc107'; // Yellow
      case TypeContratEnum.Stage:
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  }
  navigateToDetailsnavigateToDetail(offre: OffreEmploi): void {
    this.router.navigate(['/job-details', offre.idOffreEmploi]);
  }
}