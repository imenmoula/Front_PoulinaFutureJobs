// profile-update.component.ts
import { FileUploadService } from './../../shared/services/file-upload.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService, EditProfileRequest, Profile } from '../../shared/services/account.service';
import { Filiale } from '../../Models/filiale.model';
import { ProfileService } from '../../shared/services/profile.service';
import { FilialeService } from '../../shared/services/filiale.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CandidateFooterComponent } from '../../CandidateFront/components/candidate-footer/candidate-footer.component';
import { CandidateHeaderComponent } from '../../CandidateFront/components/candidate-header/candidate-header.component';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,CandidateFooterComponent,CandidateHeaderComponent],
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
  successMessage: string | null = null;
  isSubmitting: boolean = false;
  profileForm: FormGroup;
  profile: Profile | null = null;
  filiales: Filiale[] = [];
  isAdminOrRecruteur: boolean = false;
  photoPreview: string | null = null;
  errorMessage: string | null = null;
  progress = 75;
  skillValidation = 90;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private filialeService: FilialeService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      idFiliale: [{ value: '', disabled: true }],
      dateNaissance: [''],
      photo: [''],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  };

  ngOnInit(): void {
    this.isAdminOrRecruteur = this.checkAdminOrRecruteur();
    if (this.isAdminOrRecruteur) {
      this.profileForm.get('idFiliale')?.enable();
      this.profileForm.get('dateNaissance')?.setValidators([Validators.required]);
      this.profileForm.get('dateNaissance')?.updateValueAndValidity();
    }

    this.loadProfile();
    this.loadFiliales();
  }

  private checkAdminOrRecruteur(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken = this.decodeToken(token);
      const role = decodedToken['role'] || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role === 'Admin' || role === 'Recruteur';
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  loadProfile(): void {
    this.accountService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          nom: profile.nom,
          prenom: profile.prenom,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          adresse: profile.adresse,
          ville: profile.ville,
          pays: profile.pays,
          idFiliale: profile.filiale?.idFiliale || '',
          dateNaissance: profile.dateNaissance 
            ? new Date(profile.dateNaissance).toISOString().split('T')[0] 
            : '',
          photo: profile.photo
        });
        this.photoPreview = profile.photoUrl || null;
      },
      error: (error) => {
        console.error('Failed to load profile', error);
        this.errorMessage = 'Échec du chargement du profil. Veuillez réessayer.';
      }
    });
  }

  loadFiliales(): void {
    this.filialeService.getFiliales().subscribe({
      next: (filiales) => this.filiales = filiales,
      error: (error) => {
        console.error('Failed to load filiales', error);
        this.errorMessage = 'Échec du chargement des filières.';
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // File size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'La photo ne doit pas dépasser 2MB';
      return;
    }

    this.fileUploadService.uploadProfilePhoto(file).subscribe({
      next: (response) => {
        this.profileForm.patchValue({ photo: response.filePath });
        this.photoPreview = response.fileUrl;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Failed to upload photo', error);
        this.errorMessage = 'Échec du téléchargement de la photo. Formats acceptés: JPG, PNG. Taille max: 2MB';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = true;

    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      
      // Vérification de la cohérence des mots de passe
      if (formValue.newPassword && !formValue.currentPassword) {
        this.errorMessage = 'Veuillez saisir votre mot de passe actuel pour modifier le mot de passe';
        this.isSubmitting = false;
        return;
      }

      // Créer un nouvel objet avec les noms de propriétés corrects
      const profileData: EditProfileRequest = {
        ...formValue,
        // Renommer les champs de mot de passe
        CurrentPassword: formValue.currentPassword,
        NewPassword: formValue.newPassword,
        // Supprimer les anciennes propriétés
        currentPassword: undefined,
        newPassword: undefined,
        
        idFiliale: this.isAdminOrRecruteur ? formValue.idFiliale : undefined,
        dateNaissance: formValue.dateNaissance || undefined
      };
      
      this.accountService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.isSubmitting = false;
          // Réinitialiser les champs de mot de passe
          this.profileForm.get('currentPassword')?.reset();
          this.profileForm.get('newPassword')?.reset();
          this.profileForm.get('confirmPassword')?.reset();
          this.loadProfile();
        },
        error: (error) => {
          console.error('Failed to update profile', error);
          
          // Améliorer le message d'erreur
          if (error.error?.errors) {
            this.errorMessage = error.error.errors.join(', ');
          } else {
            this.errorMessage = error.error?.message || 'Échec de la mise à jour du profil. Veuillez vérifier vos informations.';
          }
          
          this.isSubmitting = false;
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      this.isSubmitting = false;
    }
  }

  // Nouvelle méthode pour le nom complet
  getFullName(): string {
    return this.profile 
      ? `${this.profile.prenom} ${this.profile.nom}` 
      : 'Chargement...';
  }

  // Nouvelle méthode pour la déconnexion
  onLogout(): void {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }
}