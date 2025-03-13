import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartementService } from '../../shared/services/departement.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { Departement } from '../../Models/departement';
import { Filiale } from '../../Models/filiale.model';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-departement-details',
  templateUrl: './departement-details.component.html',
  styleUrls: ['./departement-details.component.css'],
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, SidebarComponent]
})
export class DepartementDetailsComponent implements OnInit {
  departement: Departement | null = null;
  filiale: Filiale | null = null;
  errorMessages: string[] = [];
 

  constructor(
    private route: ActivatedRoute,
    private departementService: DepartementService,
    private filialeService: FilialeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDepartementDetails(id);
    } else {
      this.showError(['Aucun ID de département fourni']);
      this.router.navigate(['/departements']);
    }
  }

  loadDepartementDetails(id: string): void {
    this.departementService.getDepartementById(id).subscribe({
      next: (departement) => {
        this.departement = departement;
        // Fetch Filiale if idFiliale exists
        if (departement.idFiliale) {
          this.loadFilialeDetails(departement.idFiliale);
        } else {
          this.showError(['Aucune filiale associée à ce département']);
        }
      },
      error: (error) => {
        this.showError(['Échec du chargement des détails du département : ' + error.message]);
      }
    });
  }

  loadFilialeDetails(idFiliale: string): void {
    this.filialeService.getFiliale(idFiliale).subscribe({
      next: (filiale) => {
        this.filiale = filiale;
      },
      error: (error) => {
        this.showError(['Échec du chargement des détails de la filiale : ' + error.message]);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/Departements']);
  }

  private showError(messages: string[]): void {
    this.errorMessages = messages;
    setTimeout(() => {
      this.errorMessages = [];
    }, 5000); // Clear after 5 seconds
  }
}