// 

import { Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Remove ToastrModule.forRoot()
  templateUrl: './login.component.html',
  styles: [`
    .login-main {
      position: relative;
    }
    .login-toastr {
      position: absolute !important;
      top: 10px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 90% !important;
      max-width: 300px !important;
      z-index: 9999 !important;
    }
  `],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService // Injected, no need for providers since it’s global
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.toastr.info('Login page loaded', 'Debug'); // Test Toastr on init
    if (this.service.isLoggedIn()) {
      this.redirectBasedOnRoles();
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
          this.toastr.success('Login successful!', 'Success');
          this.redirectBasedOnRoles();
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error('Incorrect email or password.', 'Login Failed');
          } else {
            this.toastr.error(`Error during login: ${err.message}`, 'Login Error');
          }
        },
      });
    } else {
      this.toastr.warning('Please fill in all required fields.', 'Form Invalid');
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
    } 
    else {
      this.router.navigateByUrl('/forbidden');
    }
  }
}