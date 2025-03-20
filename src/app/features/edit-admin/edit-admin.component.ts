// import { Role } from './../../Models/role.model';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UserService } from '../../shared/services/user.service';
// import { CommonModule } from '@angular/common';
// import { RoleService } from '../../shared/services/role.service';
// import { UserRole } from '../../Models/user-role.model';

// @Component({
//   selector: 'app-edit-admin',
//   standalone: true,
//   imports: [FormsModule,CommonModule],
//   templateUrl: './edit-admin.component.html',
//   styleUrls: ['./edit-admin.component.css']
// })
// export class EditAdminComponent implements OnInit {
 
//   adminForm: FormGroup;
//   roles: any[] = []; // Liste des rôles
//   adminId: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private roleService: RoleService,
//     private router: Router,
//     private snackBar: MatSnackBar,
//     private route: ActivatedRoute
//   ) {
//     this.adminForm = this.fb.group({
//       nom: ['', Validators.required],
//       prenom: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.minLength(6)], // Optionnel pour la modification
//       role: ['', Validators.required] // Champ pour le rôle
//     });
//   }

//   ngOnInit(): void {
//     this.loadRoles(); // Charger les rôles au démarrage
//     this.adminId = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID de l'utilisateur
//     if (this.adminId) {
//       this.loadAdminDetails(this.adminId); // Charger les détails de l'utilisateur
//     }
//   }

//   loadRoles(): void {
//     this.roleService.getRoles().subscribe(
//       roles => {
//         console.log('Rôles chargés:', roles);
//         this.roles = roles;
//       },
//       error => console.error('Erreur lors du chargement des rôles', error)
//     );
//   }

//   lloadAdminDetails(id: string): void {
//     this.userService.getUserById(id).subscribe(
//       admin => {
//         console.log('Détails de l\'administrateur:', admin);
  
//         // Pré-remplir le formulaire avec les informations de l'utilisateur
//         this.adminForm.patchValue({
//           nom: admin.nom,
//           prenom: admin.prenom,
//           email: admin.email,
//         });
  
//         // Trouver le rôle actuel de l'utilisateur
//         const userRole = admin.userRoles?.find(this.roles => role.role.name === 'Admin');
//         if (userRole) {
//           this.adminForm.get('role')?.setValue(UserRole.role.id); // Pré-sélectionner le rôle actuel
//         } else {
//           console.warn('Aucun rôle trouvé pour cet utilisateur.');
//         }
//       },
//       error => console.error('Erreur lors du chargement des détails:', error)
//     );
//   }

//   onSubmit(): void {
//     if (this.adminForm.invalid || !this.adminId) {
//       return;
//     }

//     const updatedAdmin = this.adminForm.value;
//     this.userService.updateUser(this.adminId, updatedAdmin).subscribe({
//       next: () => {
//         this.snackBar.open('Administrateur mis à jour avec succès !', 'Fermer', { duration: 3000 });
//         this.router.navigate(['/admin']);
//       },
//       error: (err) => {
//         console.error('Erreur lors de la mise à jour:', err);
//         this.snackBar.open('Erreur lors de la mise à jour.', 'Fermer', { duration: 3000 });
//       }
//     });
//   }
// }
