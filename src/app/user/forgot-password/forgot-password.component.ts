import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-forgot-password',
  imports: [],
  templateUrl: './forgot-password.component.html',
  styles: ``
})


export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.http.post('https://your-api-url/api/auth/forgot-password', { email })
        .subscribe({
          next: (response: any) => {
            this.successMessage = 'Un lien de réinitialisation a été envoyé à votre email.';
            this.errorMessage = '';
          },
          error: (err) => {
            this.errorMessage = 'Échec de l\'envoi du lien de réinitialisation. Veuillez réessayer.';
            this.successMessage = '';
          }
        });
    }
  }
}
