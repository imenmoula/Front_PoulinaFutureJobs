import { Component, Input } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-header.component.html',
  styles: []
})
export class CandidateHeaderComponent {
  @Input() showLogout: boolean = true;
  fullName: string = '';
  isAuthenticated: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.fullName = this.authService.getUserFullName();
    }
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.isAuthenticated = false;
    this.fullName = '';
    this.router.navigateByUrl('/signin');
  }
  }

