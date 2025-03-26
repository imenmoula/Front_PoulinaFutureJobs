// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UserService } from '../../shared/services/user.service';
// import { RoleService } from '../../shared/services/role.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule,FormsModule,RouterModule,RouterLink],
//   templateUrl: './admin-form.component.html',
//   styleUrls: ['./admin-form.component.css']
// })
// export class AdminFormComponent implements OnInit {
//   adminForm: FormGroup;
//   roles: any[] = [];
//   adminId: string | null = null;
//   isEditMode: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private roleService: RoleService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {
//     this.adminForm = this.fb.group({
//       id: [''],
//       nom: ['', Validators.required],
//       prenom: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       role: ['', Validators.required],
//       fullName: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.loadRoles();

//     this.adminId = this.route.snapshot.paramMap.get('id');
//     if (this.adminId) {
//       this.isEditMode = true;
//       this.loadAdminDetails(this.adminId);
//     }
//   }

//   loadRoles(): void {
//     this.roleService.getRoles().subscribe({
//       next: (roles) => {
//         console.log('Rôles chargés:', roles);
//         this.roles = roles;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des rôles', error);
//         this.snackBar.open('Erreur lors du chargement des rôles.', 'Fermer', { duration: 3000 });
//       }
//     });
//   }

//   loadAdminDetails(id: string): void {
//     this.userService.getUserById(id).subscribe({
//       next: (response) => {
//         const admin = response.data ? response.data : response;
//         console.log('Détails de l\'administrateur:', admin);

//         this.adminForm.patchValue({
//           id: admin.id,
//           nom: admin.nom,
//           prenom: admin.prenom,
//           email: admin.email,
//           fullName: admin.fullName,
//           role: admin.role
//         });
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des détails:', error);
//         this.snackBar.open('Erreur lors du chargement des détails.', 'Fermer', { duration: 3000 });
//       }
//     });
//   }

//   onSubmit(): void {
//     if (this.adminForm.invalid) {
//       this.adminForm.markAllAsTouched();
//       return;
//     }

//     const adminData = {
//       ...this.adminForm.value,
//       fullName: `${this.adminForm.value.prenom} ${this.adminForm.value.nom}`,
//       id: this.adminId || undefined
//     };

//     if (this.isEditMode && this.adminId) {
//       this.userService.updateUser(this.adminId, adminData).subscribe({
//         next: () => {
//           this.snackBar.open('Administrateur mis à jour avec succès !', 'Fermer', { duration: 3000 });
//           this.router.navigate(['/admins']);
//         },
//         error: (err) => {
//           console.error('Erreur lors de la mise à jour:', err);
//           this.snackBar.open('Erreur lors de la mise à jour: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
//         }
//       });
//     } else {
//       this.userService.createUser(adminData).subscribe({
//         next: () => {
//           this.snackBar.open('Administrateur ajouté avec succès !', 'Fermer', { duration: 3000 });
//           this.router.navigate(['/admins']);
//         },
//         error: (err) => {
//           console.error('Erreur lors de l\'ajout:', err);
//           this.snackBar.open('Erreur lors de l\'ajout: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
//         }
//       });
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UserService } from '../../shared/services/user.service';
// import { RoleService } from '../../shared/services/role.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule,FormsModule,RouterModule,RouterLink],
//   templateUrl: './admin-form.component.html',
//   styleUrls: ['./admin-form.component.css']
// })
// export class AdminFormComponent implements OnInit {
//   adminForm: FormGroup;
//   roles: any[] = [];
//   adminId: string | null = null;
//   isEditMode: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private roleService: RoleService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {
//     this.adminForm = this.fb.group({
//       id: [''],
//       nom: ['', Validators.required],
//       prenom: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       role: ['', Validators.required],
//       fullName: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.loadRoles();

//     this.adminId = this.route.snapshot.paramMap.get('id');
//     if (this.adminId) {
//       this.isEditMode = true;
//       this.loadAdminDetails(this.adminId);
//     }
//   }

//   loadRoles(): void {
//     this.roleService.getRoles().subscribe({
//       next: (roles) => {
//         console.log('Rôles chargés:', roles);
//         this.roles = roles;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des rôles', error);
//         this.snackBar.open('Erreur lors du chargement des rôles.', 'Fermer', { duration: 3000 });
//       }
//     });
//   }

//   loadAdminDetails(id: string): void {
//     this.userService.getUserById(id).subscribe({
//       next: (response) => {
//         const admin = response.data ? response.data : response;
//         console.log('Détails de l\'administrateur:', admin);

//         this.adminForm.patchValue({
//           id: admin.id,
//           nom: admin.nom,
//           prenom: admin.prenom,
//           email: admin.email,
//           fullName: admin.fullName,
//           role: admin.role
//         });
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des détails:', error);
//         this.snackBar.open('Erreur lors du chargement des détails.', 'Fermer', { duration: 3000 });
//       }
//     });
//   }

//   onSubmit(): void {
//     if (this.adminForm.invalid) {
//       this.adminForm.markAllAsTouched();
//       return;
//     }

//     const adminData = {
//       ...this.adminForm.value,
//       fullName: `${this.adminForm.value.prenom} ${this.adminForm.value.nom}`,
//       id: this.adminId || undefined
//     };

//     if (this.isEditMode && this.adminId) {
//       this.userService.updateUser(this.adminId, adminData).subscribe({
//         next: () => {
//           this.snackBar.open('Administrateur mis à jour avec succès !', 'Fermer', { duration: 3000 });
//           this.router.navigate(['/admins']);
//         },
//         error: (err) => {
//           console.error('Erreur lors de la mise à jour:', err);
//           this.snackBar.open('Erreur lors de la mise à jour: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
//         }
//       });
//     } else {
//       this.userService.createUser(adminData).subscribe({
//         next: () => {
//           this.snackBar.open('Administrateur ajouté avec succès !', 'Fermer', { duration: 3000 });
//           this.router.navigate(['/admins']);
//         },
//         error: (err) => {
//           console.error('Erreur lors de l\'ajout:', err);
//           this.snackBar.open('Erreur lors de l\'ajout: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
//         }
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,RouterModule],
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  userForm: FormGroup;
  roles: any[] = [];
  userId: string | null = null;
  isEditMode: boolean = false;
  generatedPassword: string | null = null;
  userType: 'admin' | 'recruiter' = 'admin'; 

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ville: [''],
      role: ['', Validators.required],
      fullName: ['']
    });
  }

  ngOnInit(): void {
    // Déterminer si on est sur la route admin ou recruiter
    const path = this.route.snapshot.url[0]?.path;
    this.userType = path === 'admin' ? 'admin' : 'recruiter';

    this.loadRoles();

    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      this.loadUserDetails(this.userId);
    }
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        console.log('Rôles chargés:', roles);
        this.roles = roles;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rôles', error);
        this.snackBar.open('Erreur lors du chargement des rôles.', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadUserDetails(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        const user = response.data ? response.data : response;
        console.log('Détails de l\'utilisateur:', user);

        this.userForm.patchValue({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          ville: user.ville,
          fullName: user.fullName,
          role: user.role
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.snackBar.open('Erreur lors du chargement des détails.', 'Fermer', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = {
      ...this.userForm.value,
      fullName: `${this.userForm.value.prenom} ${this.userForm.value.nom}`,
      id: this.userId || undefined
    };

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.snackBar.open(`${this.userType === 'admin' ? 'Administrateur' : 'Recruteur'} mis à jour avec succès !`, 'Fermer', { duration: 3000 });
          this.router.navigate([`/${this.userType}`]);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.snackBar.open('Erreur lors de la mise à jour: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          this.generatedPassword = response.data.GeneratedPassword;
          this.snackBar.open(`${this.userType === 'admin' ? 'Administrateur' : 'Recruteur'} ajouté avec succès ! Mot de passe généré : ${this.generatedPassword}`, 'Fermer', { duration: 5000 });
          this.router.navigate([`/${this.userType}`]);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout:', err);
          this.snackBar.open('Erreur lors de l\'ajout: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
        }
      });
    }
  }
  onCancel(): void {
    this.router.navigate([`/${this.userType}`]);
  }

  get userTypeLabel(): string {
    return this.userType === 'admin' ? 'Administrateur' : 'Recruteur';
  }

}