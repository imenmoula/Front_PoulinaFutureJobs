import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styles: ``
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  token: string = '';
  email: string = '';
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Extract token and email from URL query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      if (!this.token || !this.email) {
        this.errorMessage = 'Lien de réinitialisation invalide.';
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token && this.email) {
      this.loading = true;
      const newPassword = this.resetPasswordForm.get('password')?.value;
      // Send email, token, and newPassword to the API
      this.http.post(`${this.apiUrl}/reset-password`, {
        email: this.email,
        token: this.token,
        Password: newPassword ,
        ConfirmPassword : this.resetPasswordForm.get('confirmPassword')?.value
      }).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
            this.errorMessage = '';
            this.resetPasswordForm.reset();
            // Redirect to login after 3 seconds
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.errorMessage = response.message || 'Échec de la réinitialisation du mot de passe.';
            this.successMessage = '';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}