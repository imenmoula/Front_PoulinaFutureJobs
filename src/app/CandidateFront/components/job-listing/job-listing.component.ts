import { Component, OnInit } from '@angular/core';
import { OffreEmploi } from '../../../Models/offre-emploi.model';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [FormsModule,CommonModule],
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
  specialite: string = '';
  typeContrat: string = '';
  modeTravail: string = '';

  constructor(private offreService: OffreEmploiService) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.offreService.getAllOffres().subscribe(
      (data: OffreEmploi[]) => {
        this.offres = data;
        this.filterOffres(); // Apply initial filter
      },
      (error: any) => {
        console.error('Error loading offers:', error);
      }
    );
  }

  filterOffres(): void {
    this.offreService.searchOffres(this.specialite, '', this.typeContrat, '', this.modeTravail, '').subscribe(
      (data) => {
        this.filteredOffres = data.offresEmploi || [];
      },
      (error) => {
        console.error('Error filtering offers:', error);
      }
    );
  }

  onFilterChange(): void {
    this.filterOffres();
  }
}