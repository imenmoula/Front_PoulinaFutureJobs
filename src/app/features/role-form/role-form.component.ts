import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  imports: [RouterLink, CommonModule, FormsModule, FooterComponent, HeaderComponent, SidebarComponent],
  templateUrl: './role-form.component.html',
  styles: ``
})
export class RoleFormComponent implements OnInit {
  role: Role = new Role('');
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
      this.roleService.getRoleById(id).subscribe(
        (data) => {
          this.role = data;
        },
        (error) => {
          this.errorMessage = "Erreur lors de la récupération du rôle.";
        }
      );
    }
  }

  saveRole(): void {
    if (!this.role.name || this.role.name.length < 2) {
      this.errorMessage = "Le nom du rôle doit avoir au moins 2 caractères.";
      return;
    }

    if (this.isEditMode) {
      this.roleService.updateRole(this.role.id, this.role).subscribe(
        () => {
          this.showSuccessMessage('Rôle mis à jour avec succès !');
          this.router.navigate(['/roles']);
        },
        () => {
          this.errorMessage = "Erreur lors de la mise à jour du rôle.";
        }
      );
    } else {
      this.roleService.addRole(this.role).subscribe(
        () => {
          this.showSuccessMessage('Rôle ajouté avec succès !');
          this.router.navigate(['/roles']);
        },
        () => {
          this.errorMessage = "Erreur lors de l'ajout du rôle.";
        }
      );
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
