import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly service: AuthService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
      ]],
      confirmPassword: ['']
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  getFirstError(control: AbstractControl | null): string {
    if (!control || !control.errors) return '';
    return Object.keys(control.errors)[0];
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
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
    if (this.form.valid) {
      this.service.createUser(this.form.value)
        .subscribe({
          next: (res: any) => {
            if (res && res.succeeded) {
              this.form.reset();
              this.isSubmitted = false;
              this.toastr.success('New user created!', 'Registration Successful');
            } else {
              this.toastr.error('Registration failed. Please try again.', 'Registration Failed');
              console.error('Unexpected response:', res);
            }
          },
          error: err => {
            if (err.error.errors) {
              err.error.errors.forEach((x: any) => {
                switch (x.code) {
                  case "DuplicateUserName":
                    this.toastr.error('Username is already taken.', 'Registration Failed');
                    break;
                  case "DuplicateEmail":
                    this.toastr.error('Email is already taken.', 'Registration Failed');
                    break;
                  default:
                    this.toastr.error('Contact the developer', 'Registration Failed');
                    console.log(x);
                    break;
                }
              });
            } else {
              this.toastr.error('An unexpected error occurred. Please try again.', 'Registration Failed');
              console.log('error:', err);
            }
          }
        });
    }
  }
  
}