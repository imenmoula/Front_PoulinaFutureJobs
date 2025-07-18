import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CandidateFooterComponent } from '../candidate-footer/candidate-footer.component';
import { CandidateHeaderComponent } from '../candidate-header/candidate-header.component';

@Component({
  selector: 'app-aprops',
  imports: [CandidateFooterComponent,CandidateHeaderComponent],
  templateUrl: './aprops.component.html',
  styleUrls: [
    './aprops.component.css',
    // '../../../../assets/User/css/bootstrap.min.css',
    // '../../../../assets/User/css/owl.carousel.min.css',
    // '../../../../assets/User/css/flaticon.css',
    // '../../../../assets/User/css/price_rangs.css',
    // '../../../../assets/User/css/slicknav.css',
    // '../../../../assets/User/css/animate.min.css',
    // '../../../../assets/User/css/magnific-popup.css',
    // '../../../../assets/User/css/fontawesome-all.min.css',
    // '../../../../assets/User/css/themify-icons.css',
    // '../../../../assets/User/css/slick.css',
    // '../../../../assets/User/css/nice-select.css',
    // '../../../../assets/User/css/style.css'
  ],
})
export class ApropsComponent {
  currentYear = new Date().getFullYear();

  // constructor(public authService: AuthService, private router: Router

  // ) {}
  // onLogout(): void {
  //   this.authService.deleteToken();
  //   this.router.navigateByUrl('/signin');
  // }
}
