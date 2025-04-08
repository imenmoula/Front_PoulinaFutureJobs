
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FooterComponent } from '../../layoutBackend/footer/footer.component';
import { HeaderComponent } from '../../layoutBackend/header/header.component';
import { SidebarComponent } from '../../layoutBackend/sidebar/sidebar.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FooterComponent,HeaderComponent,SidebarComponent],
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
  roles: string[] = ['Candidate', 'Recruteur', 'Admin'];
  userType: string | null = null;
  sidebarOpen:boolean=false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
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
    this.userType = this.route.snapshot.paramMap.get('type')?.toLowerCase() || 'user';
    this.userId = this.route.snapshot.paramMap.get('id');

    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      this.userForm.get('role')?.disable();
    }

    if (this.userId) {
      this.isEditMode = true;
      this.loadUserDetails(this.userId);
    } else {
      const defaultRole = this.userType === 'candidate' ? 'Candidate' :
                         this.userType === 'recruiter' ? 'Recruteur' :
                         this.userType === 'admin' ? 'Admin' : 'Candidate';
      this.userForm.patchValue({ role: defaultRole });
    }

    // Vérification d'email uniquement en mode création
    this.userForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(email => {
      if (email && this.userForm.get('email')?.valid && !this.isEditMode) {
        this.checkEmail(email);
      } else {
        this.emailExists = false;
        this.userForm.get('email')?.setErrors(null);
      }
    });

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

    // Désactiver l'email en mode édition dès l'initialisation
    if (this.isEditMode) {
      this.userForm.get('email')?.disable();
    }
  }

  loadUserDetails(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log('Réponse de getUserById :', response);
        const user = response.data ? response.data : response;
        if (!user) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Utilisateur non trouvé.',
          });
          this.router.navigate([`/${this.userType}`]);
          return;
        }
        this.userForm.patchValue({
          id: user.id,
          email: user.email || '',
          nom: user.nom || '',
          prenom: user.prenom || '',
          fullName: user.fullName || `${user.prenom || ''} ${user.nom || ''}`.trim(),
          phone: user.phone || '',
          entreprise: user.entreprise || '',
          poste: user.poste || '',
          role: typeof user.role === 'object' ? user.role.name : user.role || 'Candidate'
        });
        this.originalEmail = user.email;
        this.userForm.get('email')?.disable(); // Désactiver l'email après chargement
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de Chargement',
          text: error.error?.message || error.message || 'Erreur inconnue',
        });
        this.router.navigate([`/${this.userType}`]);
      }
    });
  }

  checkEmail(email: string): void {
    this.userService.checkEmail(email).subscribe({
      next: (response) => {
        this.emailExists = response.exists && email !== this.originalEmail;
        if (this.emailExists) {
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

  shouldShowPhoneNumber(role: string): boolean {
    return role === 'Recruteur';
  }

  shouldShowEntreprise(role: string): boolean {
    return role === 'Recruteur' || role === 'Admin';
  }

  shouldShowPoste(role: string): boolean {
    return role === 'Recruteur';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid || (!this.isEditMode && this.emailExists)) {
      this.userForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Veuillez corriger les erreurs dans le formulaire.',
      });
      return;
    }

    const userData = {
      id: this.userId,
      email: this.isEditMode ? this.originalEmail : this.userForm.value.email, // Conserver l'email original en mode édition
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
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Utilisateur mis à jour avec succès !',
              timer: 2000,
              showConfirmButton: false
            });
            this.router.navigate([`/${this.userType}`]);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: response.message || 'Erreur inconnue',
            });
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise àaché jour :', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur de Mise à Jour',
            text: `${err.error?.message || err.message || 'Erreur inconnue'}${err.error?.errors ? ' - ' + err.error.errors.join(', ') : ''}`,
          });
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Réponse de createUser :', response);
          if (response.success) {
            this.generatedPassword = response.data?.GeneratedPassword || response.data?.generatedPassword || 'N/A';
            const assignedRole = response.data?.Role || response.data?.role || userData.role;
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: `Utilisateur ajouté avec succès ! Rôle : ${assignedRole}, Mot de passe : ${this.generatedPassword}`,
              timer: 3000,
              showConfirmButton: false
            });
            this.userForm.reset();
            this.submitted = false;
            this.emailExists = false;
            const defaultRole = this.userType === 'candidate' ? 'Candidate' :
                               this.userType === 'recruiter' ? 'Recruteur' :
                               this.userType === 'admin' ? 'Admin' : 'Candidate';
            this.userForm.patchValue({ role: defaultRole });
            this.router.navigate([`/${this.userType}`]);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: response.message || 'Erreur inconnue',
            });
          }
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout :', err);
          const errorMessage = err.error?.message || err.message || 'Erreur inconnue';
          const errorDetails = err.error?.errors ? err.error.errors.join(', ') : '';
          Swal.fire({
            icon: 'error',
            title: 'Erreur d\'Ajout',
            text: `${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`,
          });
          if (errorMessage.includes('email est déjà utilisé')) {
            this.emailExists = true;
            this.userForm.get('email')?.setErrors({ emailExists: true });
          }
        }
      });
    }
  }

   onCancel(): void {
    this.router.navigate([`/admins`]);
  }

  get userTypeLabel(): string {
    return this.userType === 'candidate' ? 'Candidat' :
           this.userType === 'recruiter' ? 'Recruteur' :
           this.userType === 'admin' ? 'Administrateur' : 'Utilisateur';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}