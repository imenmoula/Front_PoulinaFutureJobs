import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  constructor(private router: Router) { }
  onlogout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signin');
  }

}
