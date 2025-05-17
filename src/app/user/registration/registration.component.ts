import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registration.component.html',
  styles: [`
    .form-input.position-relative {
      position: relative;
    }
    .show-hide {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 1rem;
      color: #6c757d;
    }
    .show-hide:hover {
      color: #007bff;
    }
    .error-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
  `]
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  isSubmitted: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly service: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
    this.initializeForm();
    Swal.fire({
      title: 'Info',
      text: 'Bienvenue dans l\'inscription !',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/) // Au moins un caractère spécial
      ]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  getFirstError(control: AbstractControl | null): string {
    if (!control || !control.errors) return '';
    return Object.keys(control.errors)[0];
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword) {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control !== null && 
           control.invalid && 
           (this.isSubmitted || control.touched || control.dirty);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire Invalide',
        text: 'Veuillez corriger les erreurs dans le formulaire avant de soumettre.',
      });
      return;
    }

    this.service.createUser(this.form.value).subscribe({
      next: (res: any) => {
        if (res && res.succeeded) {
          this.form.reset();
          this.isSubmitted = false;
          Swal.fire({
            icon: 'success',
            title: 'Inscription Réussie',
            text: 'Compte créé avec succès !',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigateByUrl('/dashboard');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur d\'Inscription',
            text: res.message || 'L\'inscription a échoué de manière inattendue.',
          });
          this.isSubmitted = false;
        }
      },
      error: (err) => {
        if (err.error?.errors) {
          err.error.errors.forEach((x: any) => {
            switch (x.code) {
              case 'DuplicateUserName':
                Swal.fire({
                  icon: 'error',
                  title: 'Inscription Échouée',
                  text: 'Ce nom d\'utilisateur est déjà utilisé.',
                });
                break;
              case 'DuplicateEmail':
                Swal.fire({
                  icon: 'error',
                  title: 'Inscription Échouée',
                  text: 'Cet email est déjà enregistré.',
                });
                break;
              default:
                Swal.fire({
                  icon: 'error',
                  title: 'Inscription Échouée',
                  text: x.description || 'Une erreur s\'est produite. Veuillez contacter le support.',
                });
                break;
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur Serveur',
            text: err.message || 'Impossible de s\'inscrire. Veuillez réessayer plus tard.',
          });
        }
        this.isSubmitted = false;
      }
    });
  }
}