import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-edit',
  standalone: true,
  imports: [FooterComponent,ReactiveFormsModule,RouterModule,CommonModule,FormsModule,SidebarComponent],
  templateUrl: './recruiter-edit.component.html',
  styles: ``,
})
export class RecruiterEditComponent implements OnInit {
  editForm: FormGroup;
  roles: Role[] = [];
  recruiterId: string = '';
  sidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phoneNumber: [''],
      entreprise: [''],
      poste: [''],
      roleId: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadRecruiterData();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: (err) => console.error('Erreur lors du chargement des rôles', err)
    });
  }

  loadRecruiterData(): void {
    this.recruiterId = this.route.snapshot.paramMap.get('id') || '';
    if (this.recruiterId) {
      this.userService.getUserById(this.recruiterId).subscribe({
        next: (recruiter) => {
          this.editForm.patchValue(recruiter);
        },
        error: (err) => console.error('Erreur lors du chargement du recruteur', err)
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedRecruiter = { ...this.editForm.value, id: this.recruiterId };

      this.userService.updateUser(this.recruiterId, updatedRecruiter).subscribe({
        next: () => {
          this.snackBar.open('Recruteur mis à jour avec succès !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/recruiter/list']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du recruteur :', err);
          this.snackBar.open('Erreur lors de la mise à jour du recruteur.', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
  toggeleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
