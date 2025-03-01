// import { UserService } from './../shared/services/user.service';
// import { Router } from '@angular/router';
// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../shared/services/auth.service';
// import { HideIfClaimsNotMetDirective } from '../directives/hide-if-claims-not-met.directive';
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [HideIfClaimsNotMetDirective],
//   templateUrl: './dashboard.component.html',
//   styles: ``
// })
// export class DashboardComponent implements OnInit {
//   constructor(private router: Router,
//     private autheService: AuthService,
//     private userService: UserService) { }
//     fullName: string = ''
//     claimReq = { adminOnly: 'Admin' }; 

//   ngOnInit(): void {
//     this.userService.getUserProfile().subscribe({
//       next: (res: any) => this.fullName = res.fullName,
//       error: (err: any) => console.log('error while retrieving user profile:\n', err)
//     })
//   }
//    onlogout() {
//      this.autheService.deleteToken();
//      this.router.navigateByUrl('/signin');
//    }

// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { HideIfClaimsNotMetDirective } from '../directives/hide-if-claims-not-met.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HideIfClaimsNotMetDirective],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  fullName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => (this.fullName = res.fullName),
      error: (err: any) => console.log('error while retrieving user profile:\n', err)
    });
  }

  onLogout() {
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

  hasAdminClaim(): boolean {
    return this.authService.hasRole('Admin');
  }
}