import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;
  candidateId: string | null = null;
  isEditMode: boolean = false;
  generatedPassword: string | null = null;
  submitted: boolean = false;
  emailExists: boolean = false;
  originalEmail: string | null = null;
  isAdmin: boolean = false;
  roles: string[] = ['Candidat', 'Recruteur', 'Admin']; // Rôles disponibles
  userType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.candidateForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fullName: [''],
    
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userType = this.route.snapshot.paramMap.get('type') || 'candidate';
    this.candidateId = this.route.snapshot.paramMap.get('id');

    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      this.candidateForm.get('role')?.disable();
    }

    if (this.candidateId) {
      this.isEditMode = true;
      this.loadCandidateDetails(this.candidateId);
    } else {
      // Définir un rôle par défaut en fonction de userType
      const defaultRole = this.userType === 'candidate' ? 'Candidate' :
                         this.userType === 'recruiter' ? 'Recruteur' :
                         this.userType === 'admin' ? 'Admin' : 'Candidate';
      this.candidateForm.patchValue({ role: defaultRole });
    }

    this.candidateForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(email => {
      if (email && this.candidateForm.get('email')?.valid) {
        this.checkEmail(email);
      } else {
        this.emailExists = false;
        this.candidateForm.get('email')?.setErrors(null);
      }
    });

    // Réinitialiser les champs conditionnels si le rôle change
    this.candidateForm.get('role')?.valueChanges.subscribe(role => {
      if (!this.shouldShowEntrepriseAndPoste(role)) {
        this.candidateForm.get('entreprise')?.reset();
        this.candidateForm.get('poste')?.reset();
      }
   
    });
  }

  loadCandidateDetails(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        console.log('Réponse de getUserById :', response);
        const candidate = response.data ? response.data : response;
        if (!candidate) {
          this.snackBar.open('Utilisateur non trouvé.', 'Fermer', { duration: 3000 });
          this.router.navigate([`/${this.userType}`]);
          return;
        }
        this.candidateForm.patchValue({
          id: candidate.id,
          email: candidate.email || '',
          nom: candidate.nom || '',
          prenom: candidate.prenom || '',
          fullName: candidate.fullName || '',
        
          role: candidate.role || 'Candidate'
        });
        this.originalEmail = candidate.email;
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
          this.candidateForm.get('email')?.setErrors({ emailExists: true });
        } else {
          this.candidateForm.get('email')?.setErrors(null);
        }
      },
      error: () => {
        this.emailExists = false;
        this.candidateForm.get('email')?.setErrors(null);
      }
    });
  }

  shouldShowEntrepriseAndPoste(role: string): boolean {
    return ['Recruteur', 'Admin'].includes(role);
  }

  shouldShowCandidateFields(role: string): boolean {
    return role === 'Candidate';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.candidateForm.invalid || this.emailExists) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    const candidateData = {
      id: this.candidateId,
      email: this.candidateForm.value.email,
      nom: this.candidateForm.value.nom,
      prenom: this.candidateForm.value.prenom,
      fullName: `${this.candidateForm.value.prenom} ${this.candidateForm.value.nom}`,
    
      role: this.candidateForm.value.role
    };

    console.log('Données envoyées pour la mise à jour :', candidateData);

    if (this.isEditMode && this.candidateId) {
      this.userService.updateUser(this.candidateId, candidateData).subscribe({
        next: (response) => {
          console.log('Réponse de updateUser :', response);
          if (response.success) {
            this.snackBar.open('Utilisateur mis à jour avec succès !', 'Fermer', { duration: 3000 });
            this.router.navigate([`/${this.userType}`]);
          } else {
            this.snackBar.open('Erreur lors de la mise à jour : ' + response.message, 'Fermer', { duration: 5000 });
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
      this.userService.createUser(candidateData).subscribe({
        next: (response) => {
          if (response.success) {
            this.generatedPassword = response.data.GeneratedPassword || response.data.generatedPassword;
            const assignedRole = response.data.Role || response.data.role;
            this.snackBar.open(
              `Utilisateur ajouté avec succès ! Rôle : ${assignedRole}, Mot de passe par défaut : ${this.generatedPassword}`,
              'Fermer',
              { duration: 5000 }
            );
            this.candidateForm.reset();
            this.submitted = false;
            this.emailExists = false;
            const defaultRole = this.userType === 'candidate' ? 'Candidat' :
                               this.userType === 'recruiter' ? 'Recruteur' :
                               this.userType === 'admin' ? 'Admin' : 'Candidat';
            this.candidateForm.patchValue({ role: defaultRole });
            this.router.navigate([`/${this.userType}`]);
          } else {
            this.snackBar.open(
              `Erreur lors de l'ajout : ${response.message}`,
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
            this.candidateForm.get('email')?.setErrors({ emailExists: true });
          }
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate([`/${this.userType}`]);
  }

  get userTypeLabel(): string {
    return this.userType === 'candidate' ? 'Candidat' :
           this.userType === 'recruiter' ? 'Recruteur' :
           this.userType === 'admin' ? 'Administrateur' : 'Candidate';
  }
}