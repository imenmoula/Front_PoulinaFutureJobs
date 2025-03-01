// import { CanActivateFn } from '@angular/router';

// export const roleGuard: CanActivateFn = (route, state) => {
//   return true;
// };
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