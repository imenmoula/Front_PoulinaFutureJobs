
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // Importation nommée

interface TokenPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  FullName?: string; // Add FullName to match the backend claim
  userId?: string;
  email?: string;
  poste?: string;
  jti?: string;
  exp?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signup', formData);
  }

  signin(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signin', formData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string) {
    localStorage.setItem('TOKEN_KEY', token);
  }

  getToken(): string | null {
    return localStorage.getItem('TOKEN_KEY');
  }

  deleteToken() {
    localStorage.removeItem('TOKEN_KEY');
  }

  

  getClaims(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  getUserRoles(): string[] {
    const claims = this.getClaims();
    if (!claims) return [];
    const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || claims['role'];
    return Array.isArray(roles) ? roles : roles ? [roles] : [];
  }

  // Add this new method to get the username
  getUserFullName(): string {
    const claims = this.getClaims();
    if (!claims) return 'Utilisateur';
    // Prefer FullName if available, fall back to the name claim
    return claims.FullName || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Utilisateur';
  }



  // Optional: For debugging
  logClaims(): void {
    const claims = this.getClaims();
    if (claims) {
      console.log('JWT Claims:', claims);
    } else {
      console.log('No claims available');
    }
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }
 // Add this new method to get the username

isUserAdmin(): boolean {
  const roles = this.getUserRoles();
  return roles.includes('Admin');
}


  logout(): void {
    localStorage.removeItem('token'); // Supprime le jeton si utilisé
    console.log('Utilisateur déconnecté');
  }
}