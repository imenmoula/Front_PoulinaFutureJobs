import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
export const AuthGuard: CanActivateFn = (route, state) => {

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
};