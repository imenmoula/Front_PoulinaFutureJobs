import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-reset-password',
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
    private route: ActivatedRoute
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

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token && this.email) {
      this.loading = true;
      const newPassword = this.resetPasswordForm.get('password')?.value;
      this.http.post(`${this.apiUrl}/reset-password`, {
        email: this.email,
        token: this.token,
        newPassword
      }).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message ;
            this.errorMessage = '';
            this.resetPasswordForm.reset();
          } else {
            this.errorMessage = response.message ;
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