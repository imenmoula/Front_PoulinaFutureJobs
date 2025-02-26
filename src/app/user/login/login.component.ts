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
  form: FormGroup; // Correction du type
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Ajout d'une validation email
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.service.isloggedIn()) {
      this.router.navigateByUrl('/dashboard');
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
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          if (err.status === 400) { // Correction de l'affectation
            this.toastr.error('Incorrect email or password.', 'Login Failed');
          } else {
            this.toastr.error(`Error during login: ${err.message}`, 'Login Error');
          }
        }
      });
    }
  }
}
