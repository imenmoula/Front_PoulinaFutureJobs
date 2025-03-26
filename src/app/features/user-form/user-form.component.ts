// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UserService } from '../../shared/services/user.service';
// import { AuthService } from '../../shared/services/auth.service';
// import { CommonModule } from '@angular/common';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// @Component({
//   selector: 'app-user-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './user-form.component.html',
//   styleUrls: ['./user-form.component.css']
// })
// export class UserFormComponent implements OnInit {
//   userForm: FormGroup;
//   userId: string | null = null;
//   isEditMode: boolean = false;
//   generatedPassword: string | null = null;
//   submitted: boolean = false;
//   emailExists: boolean = false;
//   roles: string[] = ['Admin', 'Recruteur']; // Limiter les rôles disponibles (exclure "Candidate")
//   originalEmail: string | null = null;
//   userType: string | null = null;
//   isAdmin: boolean = false; // Pour vérifier si l'utilisateur connecté est un Admin

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {
//     this.userForm = this.fb.group({
//       id: [''],
//       email: ['', [Validators.required, Validators.email]],
//       nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
//       prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
//       fullName: [''],
//       // photo: [''],
//       phoneNumber: [''],
//       entreprise: [''],
//       poste: [''],
//       role: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     this.userType = this.route.snapshot.paramMap.get('type');
//     this.userId = this.route.snapshot.paramMap.get('id');

//     // Vérifier si l'utilisateur connecté est un Admin
//     this.isAdmin = this.authService.isAdmin();
//     if (!this.isAdmin) {
//       this.userForm.get('role')?.disable(); // Désactiver le champ rôle si non Admin
//     }

//     if (this.userId) {
//       this.isEditMode = true;
//       this.loadUserDetails(this.userId);
//     } else if (this.userType) {
//       const defaultRole = this.userType === 'admin' ? 'Admin' : 'Recruteur';
//       this.userForm.patchValue({ role: defaultRole });
//     }

//     this.userForm.get('email')?.valueChanges.pipe(
//       debounceTime(500),
//       distinctUntilChanged()
//     ).subscribe(email => {
//       if (email && this.userForm.get('email')?.valid) {
//         this.checkEmail(email);
//       } else {
//         this.emailExists = false;
//         this.userForm.get('email')?.setErrors(null);
//       }
//     });
//   }

//   loadUserDetails(id: string): void {
//     this.userService.getUserById(id).subscribe({
//       next: (response) => {
//         console.log('Réponse de getUserById :', response);
//         const user = response.data ? response.data : response;
//         if (!user) {
//           this.snackBar.open('Utilisateur non trouvé.', 'Fermer', { duration: 3000 });
//           this.router.navigate([`/${this.userType}`]);
//           return;
//         }
//         this.userForm.patchValue({
//           id: user.id,
//           email: user.email || '',
//           nom: user.nom || '',
//           prenom: user.prenom || '',
//           fullName: user.fullName || '',
//           // photo: user.photo || '',
//           phoneNumber: user.phoneNumber || '',
//           entreprise: user.entreprise || '',
//           poste: user.poste || '',
//           role: user.role || (this.userType === 'admin' ? 'Admin' : 'Recruteur')
//         });
//         this.originalEmail = user.email;
//       },
//       error: (error) => {
//         console.error('Erreur lors du chargement des détails :', error);
//         this.snackBar.open('Erreur lors du chargement des détails : ' + (error.error?.message || error.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
//         this.router.navigate([`/${this.userType}`]);
//       }
//     });
//   }

//   checkEmail(email: string): void {
//     this.userService.checkEmail(email).subscribe({
//       next: (response) => {
//         this.emailExists = response.exists;
//         if (this.emailExists && (!this.isEditMode || email !== this.originalEmail)) {
//           this.userForm.get('email')?.setErrors({ emailExists: true });
//         } else {
//           this.userForm.get('email')?.setErrors(null);
//         }
//       },
//       error: () => {
//         this.emailExists = false;
//         this.userForm.get('email')?.setErrors(null);
//       }
//     });
//   }

//   onSubmit(): void {
//     this.submitted = true;
//     if (this.userForm.invalid || this.emailExists) {
//       this.userForm.markAllAsTouched();
//       return;
//     }

//     const userData = {
//       id: this.userId,
//       email: this.userForm.value.email,
//       nom: this.userForm.value.nom,
//       prenom: this.userForm.value.prenom,
//       fullName: `${this.userForm.value.prenom} ${this.userForm.value.nom}`,
//       // photo: this.userForm.value.photo || '',
//       phoneNumber: this.userForm.value.phoneNumber || '',
//       entreprise: this.userForm.value.entreprise || '',
//       poste: this.userForm.value.poste || '',
//       role: this.userForm.value.role
//     };

//     console.log('Données envoyées pour la mise à jour :', userData);

//     if (this.isEditMode && this.userId) {
//       this.userService.updateUser(this.userId, userData).subscribe({
//         next: (response) => {
//           console.log('Réponse de updateUser :', response);
//           if (response.success) {
//             this.snackBar.open('Utilisateur mis à jour avec succès !', 'Fermer', { duration: 3000 });
//             this.router.navigate([`/${this.userType}`]);
//           } else {
//             this.snackBar.open('Erreur lors de la mise à jour : ' + response.message, 'Fermer', { duration: 5000 });
//           }
//         },
//         error: (err) => {
//           console.error('Erreur lors de la mise à jour :', err);
//           const errorMessage = err.error?.message || err.message || 'Erreur inconnue';
//           const errorDetails = err.error?.errors ? err.error.errors.join(', ') : '';
//           this.snackBar.open(
//             `Erreur lors de la mise à jour : ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`,
//             'Fermer',
//             { duration: 5000 }
//           );
//         }
//       });
//     } else {
//       this.userService.createUser(userData).subscribe({
//         next: (response) => {
//           if (response.success) {
//             this.generatedPassword = response.data.GeneratedPassword || response.data.generatedPassword;
//             const assignedRole = response.data.Role || response.data.role;
//             this.snackBar.open(
//               `Utilisateur ajouté avec succès ! Rôle : ${assignedRole}, Mot de passe par défaut : ${this.generatedPassword}`,
//               'Fermer',
//               { duration: 5000 }
//             );
//             this.userForm.reset();
//             this.submitted = false;
//             this.emailExists = false;
//             this.userForm.patchValue({ role: this.userType === 'admin' ? 'Admin' : 'Recruteur' });
//             this.router.navigate([`/${this.userType}`]);
//           } else {
//             this.snackBar.open(
//               `Erreur lors de l'ajout : ${response.message}`,
//               'Fermer',
//               { duration: 5000 }
//             );
//           }
//         },
//         error: (err) => {
//           console.error('Erreur lors de l\'ajout :', err);
//           const errorMessage = err.error?.message || err.message || 'Erreur inconnue';
//           const errorDetails = err.error?.errors ? err.error.errors.join(', ') : '';
//           this.snackBar.open(
//             `Erreur lors de l'ajout : ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`,
//             'Fermer',
//             { duration: 5000 }
//           );
//           if (errorMessage.includes('email est déjà utilisé')) {
//             this.emailExists = true;
//             this.userForm.get('email')?.setErrors({ emailExists: true });
//           }
//         }
//       });
//     }
//   }

//   onCancel(): void {
//     this.router.navigate([`/${this.userType}`]);
//   }

//   get userTypeLabel(): string {
//     return this.userType === 'admin' ? 'Administrateur' : 'Recruteur';
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  isEditMode: boolean = false;
  generatedPassword: string | null = null;
  submitted: boolean = false;
  emailExists: boolean = false;
  originalEmail: string | null = null;
  isAdmin: boolean = false;
  roles: string[] = ['Candidate', 'Recruteur', 'Admin']; // Inclure tous les rôles demandés
  userType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fullName: [''],
      phone: [''],
      entreprise: [''],
      poste: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userType = this.route.snapshot.paramMap.get('type')?.toLowerCase() || 'user'; // Normaliser en minuscules
    this.userId = this.route.snapshot.paramMap.get('id');

    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      this.userForm.get('role')?.disable();
    }

    if (this.userId) {
      this.isEditMode = true;
      this.loadUserDetails(this.userId);
    } else {
      // Définir un rôle par défaut en fonction de userType
      const defaultRole = this.userType === 'candidate' ? 'Candidate' :
                         this.userType === 'recruiter' ? 'Recruteur' :
                         this.userType === 'admin' ? 'Admin' : 'Candidate';
      this.userForm.patchValue({ role: defaultRole });
    }

    this.userForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(email => {
      if (email && this.userForm.get('email')?.valid) {
        this.checkEmail(email);
      } else {
        this.emailExists = false;
        this.userForm.get('email')?.setErrors(null);
      }
    });

    // Réinitialiser les champs conditionnels si le rôle change
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      if (!this.shouldShowEntreprise(role)) {
        this.userForm.get('entreprise')?.reset();
      }
      if (!this.shouldShowPoste(role)) {
        this.userForm.get('poste')?.reset();
      }
      if (!this.shouldShowPhoneNumber(role)) {
        this.userForm.get('phone')?.reset();
      }
    });
  }

  loadUserDetails(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log('Réponse de getUserById :', response);
        const user = response.data ? response.data : response;
        if (!user) {
          this.snackBar.open('Utilisateur non trouvé.', 'Fermer', { duration: 3000 });
          this.router.navigate([`/${this.userType}`]);
          return;
        }
        this.userForm.patchValue({
          id: user.id,
          email: user.email || '',
          nom: user.nom || '',
          prenom: user.prenom || '',
          fullName: user.fullName || '',
          phone: user.phone || '',
          entreprise: user.entreprise || '',
          poste: user.poste || '',
          role: user.role || 'Candidate'
        });
        this.originalEmail = user.email;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails :', error);
        this.snackBar.open('Erreur lors du chargement des détails : ' + (error.error?.message || error.message || 'Erreur inconnue'), 'Fermer', { duration: 3000 });
        this.router.navigate([`/${this.userType}`]);
      }
    });
  }

  checkEmail(email: string): void {
    this.userService.checkEmail(email).subscribe({
      next: (response) => {
        this.emailExists = response.exists;
        if (this.emailExists && (!this.isEditMode || email !== this.originalEmail)) {
          this.userForm.get('email')?.setErrors({ emailExists: true });
        } else {
          this.userForm.get('email')?.setErrors(null);
        }
      },
      error: () => {
        this.emailExists = false;
        this.userForm.get('email')?.setErrors(null);
      }
    });
  }

  // Conditions d'affichage des champs
  shouldShowPhoneNumber(role: string): boolean {
    return role === 'Recruteur'; // Caché pour Admin et Candidate
  }

  shouldShowEntreprise(role: string): boolean {
    return role === 'Recruteur' || role === 'Admin'; // Caché pour Candidate
  }

  shouldShowPoste(role: string): boolean {
    return role === 'Recruteur'; // Caché pour Admin et Candidate
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid || this.emailExists) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = {
      id: this.userId,
      email: this.userForm.value.email,
      nom: this.userForm.value.nom,
      prenom: this.userForm.value.prenom,
      fullName: `${this.userForm.value.prenom} ${this.userForm.value.nom}`,
      phone: this.userForm.value.phone || '',
      entreprise: this.userForm.value.entreprise || '',
      poste: this.userForm.value.poste || '',
      role: this.userForm.value.role
    };

    console.log('Données envoyées :', userData);

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: (response) => {
          console.log('Réponse de updateUser :', response);
          if (response.success) {
            this.snackBar.open('Utilisateur mis à jour avec succès !', 'Fermer', { duration: 3000 });
            this.router.navigate([`/${this.userType}`]);
          } else {
            this.snackBar.open('Erreur lors de la mise à jour : ' + (response.message || 'Erreur inconnue'), 'Fermer', { duration: 5000 });
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          const errorMessage = err.error?.message || err.message || 'Erreur inconnue';
          const errorDetails = err.error?.errors ? err.error.errors.join(', ') : '';
          this.snackBar.open(
            `Erreur lors de la mise à jour : ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`,
            'Fermer',
            { duration: 5000 }
          );
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Réponse de createUser :', response);
          if (response.success) {
            this.generatedPassword = response.data?.GeneratedPassword || response.data?.generatedPassword || 'N/A';
            const assignedRole = response.data?.Role || response.data?.role || userData.role;
            this.snackBar.open(
              `Utilisateur ajouté avec succès ! Rôle : ${assignedRole}, Mot de passe par défaut : ${this.generatedPassword}`,
              'Fermer',
              { duration: 5000 }
            );
            this.userForm.reset();
            this.submitted = false;
            this.emailExists = false;
            const defaultRole = this.userType === 'candidate' ? 'Candidate' :
                               this.userType === 'recruiter' ? 'Recruteur' :
                               this.userType === 'admin' ? 'Admin' : 'Candidate';
            this.userForm.patchValue({ role: defaultRole });
            this.router.navigate([`/${this.userType}`]);
          } else {
            this.snackBar.open(
              `Erreur lors de l'ajout : ${response.message || 'Erreur inconnue'}`,
              'Fermer',
              { duration: 5000 }
            );
          }
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout :', err);
          const errorMessage = err.error?.message || err.message || 'Erreur inconnue';
          const errorDetails = err.error?.errors ? err.error.errors.join(', ') : '';
          this.snackBar.open(
            `Erreur lors de l'ajout : ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`,
            'Fermer',
            { duration: 5000 }
          );
          if (errorMessage.includes('email est déjà utilisé')) {
            this.emailExists = true;
            this.userForm.get('email')?.setErrors({ emailExists: true });
          }
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate([`/${this.userType}`]);
  }

  get userTypeLabel(): string {
    return this.userType === 'candidate' ? 'Candidate' :
           this.userType === 'recruiter' ? 'Recruteur' :
           this.userType === 'admin' ? 'Administrateur' : 'Utilisateur';
  }
}