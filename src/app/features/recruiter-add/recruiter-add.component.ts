import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../Models/role.model';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recruiter-add',
  standalone: true,
  imports: [FooterComponent,HeaderComponent,SidebarComponent,CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './recruiter-add.component.html',
  styleUrls: ['./recruiter-add.component.scss']
})
export class RecruiterAddComponent {
  addForm: FormGroup;
  roles: Role[] = [];
  sidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.addForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phoneNumber: ['', Validators.pattern('^[0-9]+$')],
      entreprise: [''],
      poste: [''],
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: (err) => console.error('Erreur lors du chargement des rôles', err)
    });
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      console.log('Token actuel:', localStorage.getItem('token')); // 🔍 Vérifier le token
  
      const user = {
        ...this.addForm.value,
        userRoles: [{ userId: '', roleId: this.addForm.value.roleId }]
      };
  
      this.userService.createUser(user).subscribe({
        next: () => {
          this.snackBar.open('Recruteur ajouté avec succès !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/recruiter/list']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du recruteur :', err);
          this.snackBar.open('Erreur lors de l\'ajout du recruteur : ' + err.message, 'Fermer', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
  
  

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}