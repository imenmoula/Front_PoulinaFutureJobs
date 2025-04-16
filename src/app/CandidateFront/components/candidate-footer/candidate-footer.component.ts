import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-footer.component.html',
  styles: ['../../../assets/User/css/bootstrap.min.css',
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
    '../../../assets/User/css/style.css',]
})
export class CandidateFooterComponent {
  currentYear: number = new Date().getFullYear();
}
