import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Departement } from '../../Models/departement';
import { DepartementService } from '../../shared/services/departement.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-list',
  standalone: true,
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
  imports: [CommonModule, RouterModule,FooterComponent,HeaderComponent,SidebarComponent,FormsModule],

})
export class DepartmentListComponent implements OnInit {
 

  departements: Departement[] = [];
  sidebarOpen: boolean = false;
  departement: any;
  searchTerm: string = '';

  constructor(private departementService: DepartementService,private router: Router) {}

  ngOnInit(): void {
    this.loadDepartements();
  }

  // 🔹 Charger les départements depuis l'API
  loadDepartements(): void {
    this.departementService.getDepartements().subscribe(data => {
      this.departements = data;
    });
  }
  deleteDepartement(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce département ?")) {
      this.departementService.deleteDepartement(id).subscribe(
        () => {
          this.departements = this.departements.filter(d => d.idDepartement !== id);
          alert("Département supprimé avec succès !");
        },
        (error) => {
          console.error("Erreur lors de la suppression du département", error);
        }
      );
    }
  }
  filteredDepartements(): any[] {
    if (!this.searchTerm) {
      return this.departements;
    }
    return this.departements.filter(departement =>
      departement.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      departement.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen; // Méthode pour basculer
  }
  
}
