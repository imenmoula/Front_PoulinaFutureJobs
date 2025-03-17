import { SidebarComponent } from './../../layoutBackend/sidebar/sidebar.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FooterComponent,HeaderComponent,SidebarComponent],
  templateUrl: './role-list.component.html',
  styles: ``
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  sidebarOpen: boolean = false;

  constructor(private roleService: RoleService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  deleteRole(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      this.roleService.deleteRole(id).subscribe(() => {
        this.loadRoles();
        this.showSuccessMessage('Rôle supprimé avec succès !');
      });
    }
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
