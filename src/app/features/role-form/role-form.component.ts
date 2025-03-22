
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, SidebarComponent],
  templateUrl: './role-form.component.html',
  styles: ``
})
export class RoleFormComponent implements OnInit {
  role: Role = new Role(''); // Initialisé avec un nom vide
  isEditMode: boolean = false;
  sidebarOpen: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.roleService.getRoleById(id).subscribe({
        next: (data) => {
          // Assurez-vous que les propriétés sont correctement mappées
          this.role = new Role(
            data.name,
            data.id,
            data.normalizedName,
            data.concurrencyStamp
          );
        },
        error: (error) => {
          this.errorMessage = "Erreur lors de la récupération du rôle.";
          console.error('Error fetching role:', error);
        }
      });
    }
  }

  saveRole(): void {
    // Validation des champs
    if (!this.role.name || this.role.name.length < 2) {
      this.errorMessage = "Le nom du rôle doit avoir au moins 2 caractères.";
      return;
    }
    if (!this.role.normalizedName) {
      this.errorMessage = "Le nom normalisé est requis.";
      return;
    }

    if (this.isEditMode) {
      this.roleService.updateRole(this.role.id, this.role).subscribe({
        next: () => {
          this.showSuccessMessage('Rôle mis à jour avec succès !');
          this.router.navigate(['/roles']);
        },
        error: () => {
          this.errorMessage = "Erreur lors de la mise à jour du rôle.";
        }
      });
    } else {
      this.roleService.addRole(this.role).subscribe({
        next: () => {
          this.showSuccessMessage('Rôle ajouté avec succès !');
          this.router.navigate(['/roles']);
        },
        error: () => {
          this.errorMessage = "Erreur lors de l'ajout du rôle.";
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/roles']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
