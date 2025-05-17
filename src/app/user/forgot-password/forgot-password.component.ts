import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule], // Add both modules
  templateUrl: './forgot-password.component.html',
  styles: ``,
  // Removed duplicate imports property

})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false; // Add loading state
  private apiUrl = environment.apiBaseUrl;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true; // Set loading to true
      const email = this.forgotPasswordForm.get('email')?.value;
      this.http.post(`${this.apiUrl}/request-reset-password`, { email })
        .subscribe({
          next: (response: any) => {
            this.successMessage = 'Un lien de réinitialisation a été envoyé à votre email.';
            this.errorMessage = '';
            this.loading = false; // Reset loading
          },
          error: (err) => {
            this.errorMessage = 'Échec de l\'envoi du lien de réinitialisation. Veuillez réessayer.';
            this.successMessage = '';
            this.loading = false; // Reset loading
          }
        });
    }
  }
}