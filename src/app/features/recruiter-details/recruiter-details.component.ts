import { UserRole } from './../../Models/user-role.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/user.model';
import { Role } from '../../Models/role.model';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-recruiter-details',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,FooterComponent,HeaderComponent,SidebarComponent],
  templateUrl: './recruiter-details.component.html',
  styles: ``
})
export class RecruiterDetailsComponent  implements OnInit {
  recruiter: User | null = null;
  roles: Role[] = [];
  sidebarOpen: boolean = false; // Déjà présent, mais vérifié
  recruiterId: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService
  ) {
    this.recruiterId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadRecruiter();
    this.loadRoles();
  }

  loadRecruiter(): void {
    this.userService.getUserById(this.recruiterId).subscribe({
      next: (response) => {
        this.recruiter = response.data;
      },
      error: (err) => console.error('Erreur lors du chargement du recruteur', err)
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: (err) => console.error('Erreur lors du chargement des rôles', err)
    });
  }

  getRoleName(user: User | null): string {
    if (!user || !user.UserRoles || user.UserRoles.length === 0) return 'N/A';
    const roleId = user.UserRoles[0].roleId;
    return this.roles.find((r) => r.id === roleId)?.name || 'N/A';
  }

  toggleSidebar(): void { // Déjà présent, mais vérifié
    this.sidebarOpen = !this.sidebarOpen;
  }
}
