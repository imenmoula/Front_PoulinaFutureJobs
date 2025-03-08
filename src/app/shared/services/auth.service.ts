import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  FullName?: string;
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
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  createUser(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signup', formData);
  }

  signin(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signin', formData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
          const user = this.getClaims();
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
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
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
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

  getUserFullName(): string {
    const claims = this.getClaims();
    return claims?.FullName || claims?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Utilisateur';
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  logout(): void {
    this.deleteToken();
    console.log('Utilisateur déconnecté');
  }

  getRole(): string {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles.join(', ') : 'Aucun rôle';
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // For debugging
  logClaims(): void {
    const claims = this.getClaims();
    console.log('JWT Claims:', claims || 'No claims available');
  }
}