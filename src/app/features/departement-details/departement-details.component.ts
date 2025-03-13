import { Departement } from './../../Models/departement';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartementService } from '../../shared/services/departement.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-departement-details',
  imports: [CommonModule, RouterModule,FooterComponent,HeaderComponent,SidebarComponent],
  standalone: true,
  templateUrl: './departement-details.component.html',
  styles: ``
})
export class DepartementDetailsComponent {
  departement!: Departement;
  sidebarOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private departementService: DepartementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID depuis l'URL
    if (id) {
      this.departementService.getDepartementById(id).subscribe(
        (data) => {
          this.departement = data;
        },
        (error) => {
          console.error('Erreur lors du chargement du département', error);
        }
      );
    }
  }
  goToDepartements(): void {
    this.router.navigate(['Departements']); // Remplace '/departements' par la vraie route
 
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen; // Méthode pour basculer
  }
}

