import { Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.redirectBasedOnRoles(); // Rediriger selon les rôles au chargement
    }
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control !== null && control.invalid && (this.isSubmitted || control.touched || control.dirty);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res: any) => {
          this.service.saveToken(res.token);
          this.redirectBasedOnRoles(); // Rediriger selon les rôles après connexion
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error('Incorrect email or password.', 'Login Failed');
          } else {
            this.toastr.error(`Error during login: ${err.message}`, 'Login Error');
          }
        }
      });
    }
  }

  private redirectBasedOnRoles() {
    const roles = this.service.getUserRoles();
    if (roles.includes('Admin')) {
      this.router.navigateByUrl('/admin');
    } else if (roles.includes('Recruteur')) {
      this.router.navigateByUrl('/recruiter');
    } else if (roles.includes('Candidate')) {
      this.router.navigateByUrl('/candidate');
    } else {
      this.router.navigateByUrl('/dashboard'); // Par défaut si aucun rôle spécifique
    }
  }
}
