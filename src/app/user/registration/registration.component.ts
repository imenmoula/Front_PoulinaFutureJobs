import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FirstKeyPipe } from '../../shared/pipes/firstkey.pipe';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  // imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe, RouterLink],
  imports: [ReactiveFormsModule, CommonModule, RouterLink] ,
  templateUrl: './registration.component.html',
  styles: [],
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly service: AuthService,
    private readonly toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
    this.initializeForm();
    this.toastr.info('Welcome to registration!', 'Info'); // Optional: Test Toastr on load
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
      this.toastr.warning('Please correct the form errors before submitting.', 'Invalid Form');
      return;
    }

    this.service.createUser(this.form.value).subscribe({
      next: (res: any) => {
        if (res && res.succeeded) {
          this.form.reset();
          this.isSubmitted = false;
          this.toastr.success('Account created successfully!', 'Registration Complete');
          this.router.navigateByUrl('/dashboard');
        } else {
          this.toastr.error(res.message || 'Registration failed unexpectedly.', 'Registration Error');
        }
      },
      error: (err) => {
        if (err.error?.errors) {
          err.error.errors.forEach((x: any) => {
            switch (x.code) {
              case 'DuplicateUserName':
                this.toastr.error('This username is already in use.', 'Registration Failed');
                break;
              case 'DuplicateEmail':
                this.toastr.error('This email is already registered.', 'Registration Failed');
                break;
              default:
                this.toastr.error(x.description || 'An error occurred. Please contact support.', 'Registration Failed');
                break;
            }
          });
        } else {
          this.toastr.error(err.message || 'Unable to register. Please try again later.', 'Server Error');
        }
      },
    });
  }
}