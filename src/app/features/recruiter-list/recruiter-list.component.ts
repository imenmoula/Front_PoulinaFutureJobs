import { CommonModule } from '@angular/common';
import { UserRole } from './../../Models/user-role.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../Models/user.model';
import { Role } from '../../Models/role.model';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recruiter-list',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,FooterComponent,HeaderComponent,SidebarComponent,RouterModule],
  templateUrl: './recruiter-list.component.html',
  styles: ``,

})
export class RecruiterListComponent implements OnInit {
  recruiters: User[] = [];
  filteredRecruiters: User[] = [];
  roles: Role[] = [];
  sidebarOpen: boolean = false;
  searchForm: FormGroup;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    console.log('Initialisation de RecruiterListComponent');
    this.loadRecruiters();
    this.loadRoles();
    this.searchForm.get('searchTerm')?.valueChanges.subscribe((value) => {
      console.log('Recherche :', value);
      this.searchRecruiters(value);
    });
  }

  loadRecruiters(): void {
    console.log('Chargement des recruteurs...');
    this.userService.getUsersByRole('Recruteur').subscribe({
      next: (response) => {
        console.log('Réponse de getUsersByRole :', response);
        this.recruiters = response.data;
        this.filteredRecruiters = [...this.recruiters];
        console.log('Recruteurs chargés :', this.recruiters);
      },
      error: (err) => console.error('Erreur lors du chargement des recruteurs :', err)
    });
  }

  loadRoles(): void {
    console.log('Chargement des rôles...');
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Rôles chargés :', this.roles);
      },
      error: (err) => console.error('Erreur lors du chargement des rôles :', err)
    });
  }

  searchRecruiters(query: string): void {
    if (!query.trim()) {
      this.filteredRecruiters = [...this.recruiters];
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredRecruiters = this.recruiters.filter(
        (recruiter) =>
          recruiter.fullName?.toLowerCase().includes(lowerQuery) ||
          recruiter.email?.toLowerCase().includes(lowerQuery)
      );
    }
    console.log('Recruteurs filtrés :', this.filteredRecruiters);
  }

  getRoleName(user: User): string {
    if (!user || !user.UserRoles|| user.UserRoles.length === 0) return 'N/A';
    const roleId = user.UserRoles[0].roleId;
    return this.roles.find((r) => r.id === roleId)?.name || 'N/A';
  }

  deleteRecruiter(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce recruteur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadRecruiters(),
        error: (err) => console.error('Erreur lors de la suppression :', err)
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}