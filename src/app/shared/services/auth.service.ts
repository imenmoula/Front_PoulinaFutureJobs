import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { catchError, tap,map } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<TokenPayload | null>;
  public currentUser: Observable<TokenPayload | null>;
  private tokenKey = 'TOKEN_KEY'; // Consistent key name
  private apiUrl = environment.apiBaseUrl; // Base API URL from environment

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.currentUserSubject = new BehaviorSubject<TokenPayload | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();

    // Check token validity on initialization
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  // User creation (signup)
  createUser(formData: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/signup`, formData);
  }

  // Sign in with token handling
  signin(formData: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/signin`, formData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
          const user = this.getClaims();
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          } else {
            throw new Error('Invalid token received');
          }
        }
      })
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  // Save token to localStorage
    saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token and user data
  deleteToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Decode JWT token and return claims
  getClaims(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout(); // Logout on invalid token
      return null;
    }
  }
  


  // Get user roles from token claims
  getUserRoles(): string[] {
    const claims = this.getClaims();
    if (!claims) return [];
    const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || claims['role'];
    return Array.isArray(roles) ? roles : roles ? [roles] : [];
  }

  

  // Get user's full name
  getUserFullName(): string {
    const claims = this.getClaims();
    return claims?.FullName || claims?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Utilisateur';
  }

  // Get user ID
  getUserId(): string | null {
    const claims = this.getClaims();
    return claims?.userId || null;
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  // Check if user is an admin
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // getRecruteurs(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/recruteurs`);
  // }
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
      catchError((error) => {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        return throwError(() => new Error('Erreur lors de la récupération du profil utilisateur'));
      })
    );
  }
  logout(redirect: boolean = true): void {
    this.deleteToken();
    if (redirect) {
      this.router.navigate(['/signin']);
    }
    // console.log('Utilisateur déconnecté');
  }

  // Get user's roles as a string
  getRole(): string {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles.join(', ') : 'Aucun rôle';
  }

  // Get current user data
  getCurrentUser(): TokenPayload | null {
    return this.currentUserSubject.value;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const claims = this.getClaims();
    if (!claims || !claims.exp) return true;
    return claims.exp * 1000 < Date.now(); // Convert seconds to milliseconds
  }

  // For debugging
  logClaims(): void {
    const claims = this.getClaims();
    console.log('JWT Claims:', claims || 'No claims available');
  }

  
}