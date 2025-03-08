import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router=inject(Router);

  if (authService.isLoggedIn()) {
    const claimReq = route.data['claimReq'] as Function;
    if (claimReq) {
      const claims = authService.getClaims();
      if (!claimReq(claims)) {
        router.navigateByUrl('/forbidden')
        return false
      }
      return true
    }
    return true;
  }
  else {
    router.navigateByUrl('/signin')
    return false
  }
  

// import { CanActivateFn } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from '../shared/services/auth.service';
// import { Router } from '@angular/router';

// export const AuthGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isLoggedIn()) {
//     return true;
//   }
//   router.navigate(['/signin']);
//   return false;
// };

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const token = localStorage.getItem('token');
//     if (token) {
//       return true; // Utilisateur connecté
//     }
//     this.router.navigate(['/signin']);
//     return false; // Redirige vers la connexion
//   }
// }
};