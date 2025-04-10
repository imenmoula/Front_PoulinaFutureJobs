import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-candidate-only',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-only.component.html',
  styleUrls: [
    '../../../assets/User/css/bootstrap.min.css',
    '../../../assets/User/css/owl.carousel.min.css',
    '../../../assets/User/css/flaticon.css',
    '../../../assets/User/css/price_rangs.css',
    '../../../assets/User/css/slicknav.css',
    '../../../assets/User/css/animate.min.css',
    '../../../assets/User/css/magnific-popup.css',
    '../../../assets/User/css/fontawesome-all.min.css',
    '../../../assets/User/css/themify-icons.css',
    '../../../assets/User/css/slick.css',
    '../../../assets/User/css/nice-select.css',
    '../../../assets/User/css/style.css'
  ]
})
export class CandidateOnlyComponent {
fullName$!: Observable<string>;
constructor(
  public authService: AuthService,
  private userService: UserService,
  private router: Router
) {}

// c
onLogout(): void {
  this.authService.deleteToken(); // Suppression du token
  this.router.navigateByUrl('/signin'); // Redirection vers /signin
}
}

