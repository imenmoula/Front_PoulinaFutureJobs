import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OffreEmploiService } from '../../../shared/services/offre-emploi.service';
import { OffreEmploi } from '../../../Models/offre-emploi.model';
import { FilialeService } from '../../../shared/services/filiale.service';
import { Filiale } from '../../../Models/filiale.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: [
    './job-details.component.css',
    '../../../../assets/User/css/bootstrap.min.css',
    '../../../../assets/User/css/owl.carousel.min.css',
    '../../../../assets/User/css/flaticon.css',
    '../../../../assets/User/css/slicknav.css',
    '../../../../assets/User/css/price_rangs.css',
    '../../../../assets/User/css/animate.min.css',
    '../../../../assets/User/css/magnific-popup.css',
    '../../../../assets/User/css/fontawesome-all.min.css',
    '../../../../assets/User/css/themify-icons.css',
    '../../../../assets/User/css/slick.css',
    '../../../../assets/User/css/nice-select.css',
    '../../../../assets/User/css/style.css'
  ]
})
export class JobDetailsComponent implements OnInit {
  offre: OffreEmploi | null = null;
  filiale: Filiale | null = null;
  jobId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private offreService: OffreEmploiService,
    private filialeService: FilialeService
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.loadJobDetails(this.jobId);
    }
  }

  loadJobDetails(id: string): void {
    this.offreService.getOffreEmploi(id).subscribe(
      (response) => {
        this.offre = response.offreEmploi || response;
        if (this.offre && this.offre.idFiliale) {
          this.loadFilialeDetails(this.offre.idFiliale);
        }
      },
      (error) => {
        console.error('Error loading job details:', error);
      }
    );
  }

  loadFilialeDetails(idFiliale: string): void {
    this.filialeService.getFiliale(idFiliale).subscribe(
      (filiale) => {
        this.filiale = filiale;
      },
      (error) => {
        console.error('Error loading filiale details:', error);
      }
    );
  }
}