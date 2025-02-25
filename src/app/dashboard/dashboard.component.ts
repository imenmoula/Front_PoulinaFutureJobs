import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  constructor(private router: Router,
              private autheService:AuthService){ }
  onlogout() {
    this.autheService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

}
