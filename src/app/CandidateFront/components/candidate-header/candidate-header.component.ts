import { Component, Input } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-header.component.html',
  styleUrls:[
        './candidate-header.component.css'

  // '../../../assets/User/css/bootstrap.min.css',
  //   '../../../assets/User/css/owl.carousel.min.css',
  //   '../../../assets/User/css/flaticon.css',
  //   '../../../assets/User/css/price_rangs.css',
  //   '../../../assets/User/css/slicknav.css',
  //   '../../../assets/User/css/animate.min.css',
  //   '../../../assets/User/css/magnific-popup.css',
  //   '../../../assets/User/css/fontawesome-all.min.css',
  //   '../../../assets/User/css/themify-icons.css',
  //   '../../../assets/User/css/slick.css',
  //   '../../../assets/User/css/nice-select.css',
  //   '../../../assets/User/css/style.css',
  ],
    
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
   navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  onLogout(): void {
    this.authService.deleteToken();
    this.isAuthenticated = false;
    this.fullName = '';
    this.router.navigateByUrl('/signin');
  }
  }

