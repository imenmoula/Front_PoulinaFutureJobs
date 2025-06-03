

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface TokenPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  FullName?: string;
  userId?: string;
  email?: string;
  poste?: string;
  jti?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

interface AuthResponse {
  Token: string;
  RefreshToken: string;
  Email: string;
  Roles: string[];
  Success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<TokenPayload | null>;
  public currentUser: Observable<TokenPayload | null>;
  private tokenKey = 'TOKEN_KEY';
  private refreshTokenKey = 'REFRESH_TOKEN_KEY';
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.currentUserSubject = new BehaviorSubject<TokenPayload | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.isTokenExpired()) {
      this.logout(false); // Don't redirect on init
    }
  }

  createUser(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, formData).pipe(
      catchError(this.handleError)
    );
  }

  signin(formData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, formData).pipe(
      tap((response: AuthResponse) => {
        if (response.Success && response.Token) {
          this.saveToken(response.Token);
          if (response.RefreshToken) {
            localStorage.setItem(this.refreshTokenKey, response.RefreshToken);
          }
          const user = this.getClaims();
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          } else {
            throw new Error('Invalid token received');
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { RefreshToken: refreshToken }).pipe(
      tap((response: AuthResponse) => {
        if (response.Success && response.Token) {
          this.saveToken(response.Token);
          if (response.RefreshToken) {
            localStorage.setItem(this.refreshTokenKey, response.RefreshToken);
          }
          const user = this.getClaims();
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired()) {
      return false; // Will be handled by interceptor
    }
    return true;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  deleteToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getClaims(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
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

  getUserId(): string | null {
    const claims = this.getClaims();
    return claims?.userId || null;
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  getUserProfile(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('Utilisateur non connecté.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get(`${this.apiUrl}/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  logout(redirect: boolean = true): void {
    this.deleteToken();
    if (redirect) {
      this.router.navigate(['/signin']);
    }
  }

  getRole(): string {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles.join(', ') : 'Aucun rôle';
  }

  getCurrentUser(): TokenPayload | null {
    return this.currentUserSubject.value;
  }

  isTokenExpired(): boolean {
    const claims = this.getClaims();
    if (!claims || !claims.exp) return true;
    return claims.exp * 1000 < Date.now();
  }
 hasAccessToQuiz(): boolean {
    return this.isAdmin() || this.isRecruteur();
  }

  isRecruteur(): boolean {
    return this.hasRole('Recruteur');
  }

  logClaims(): void {
    const claims = this.getClaims();
    console.log('JWT Claims:', claims || 'No claims available');
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded['role'] || null;
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    }
    return null;
  }

  isAdminOrRecruteur(): boolean {
    const role = this.getUserRole();
    return role === 'Admin' || role === 'Recruteur';
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Code: ${error.status}, Message: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}