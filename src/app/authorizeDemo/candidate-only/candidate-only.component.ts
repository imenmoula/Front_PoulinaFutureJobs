// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { AuthService } from '../../shared/services/auth.service';
// import { UserService } from '../../shared/services/user.service';
// import { map, Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-candidate-only',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './candidate-only.component.html',
//   styles: ``
// })
// export class CandidateOnlyComponent {
// fullName$!: Observable<string>;
// constructor(
//   public authService: AuthService,
//   private userService: UserService,
//   private router: Router
// ) {}

// ngOnInit(): void {
//   this.fullName$ = this.userService.getUserProfile().pipe(
//     map((res: any) => res.fullName)
//   );
// }
// onLogout(): void {
//   this.authService.deleteToken(); // Suppression du token
//   this.router.navigateByUrl('/signin'); // Redirection vers /signin
// }
// }

