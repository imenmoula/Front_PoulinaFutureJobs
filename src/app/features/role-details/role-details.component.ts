import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [ CommonModule, FooterComponent, HeaderComponent, SidebarComponent],
  templateUrl: './role-details.component.html',
  styles: ``
})
export class RoleDetailsComponent implements OnInit {
  role: Role | null = null;
  errorMessage: string = '';
  sidebarOpen: boolean = false;

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
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

  editRole(): void {
    if (this.role) {
      this.router.navigate(['/roles/edit', this.role.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
