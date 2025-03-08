
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;

  if (authService.isLoggedIn() && authService.hasRole(requiredRole)) {
    return true;
  }
  router.navigate(['/signin']);
  return false;
};

// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     const expectedRole = route.data['role'];
//     const userRole = localStorage.getItem('userRole');

//     if (userRole === expectedRole) {
//       return true; // Rôle correspondant
//     }
//     this.router.navigate(['/signin']); // Ou une page "accès refusé"
//     return false;
//   }
// }

