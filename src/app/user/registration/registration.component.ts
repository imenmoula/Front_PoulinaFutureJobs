// 
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registration.component.html',
  styles: [],
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  isSubmitted: boolean = false;

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
      text: 'Welcome to registration!',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/),
      ]],
      confirmPassword: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
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
      confirmPassword?.setErrors({ passwordMismatch: true });
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please correct the form errors before submitting.',
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
            title: 'Registration Complete',
            text: 'Account created successfully!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigateByUrl('/dashboard');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Error',
            text: res.message || 'Registration failed unexpectedly.',
          });
        }
      },
      error: (err) => {
        if (err.error?.errors) {
          err.error.errors.forEach((x: any) => {
            switch (x.code) {
              case 'DuplicateUserName':
                Swal.fire({
                  icon: 'error',
                  title: 'Registration Failed',
                  text: 'This username is already in use.',
                });
                break;
              case 'DuplicateEmail':
                Swal.fire({
                  icon: 'error',
                  title: 'Registration Failed',
                  text: 'This email is already registered.',
                });
                break;
              default:
                Swal.fire({
                  icon: 'error',
                  title: 'Registration Failed',
                  text: x.description || 'An error occurred. Please contact support.',
                });
                break;
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: err.message || 'Unable to register. Please try again later.',
          });
        }
      },
    });
  }
}