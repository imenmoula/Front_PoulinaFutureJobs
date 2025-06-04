import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service'; // <-- Importer AuthService

export interface Profile {
  email: string;
  nom: string;
  prenom: string;
  phoneNumber: string;
  adresse: string;
  ville: string;
  pays: string;
  photo?: string;
  photoUrl?: string;
  dateNaissance?: string;
  filiale?: { idFiliale: string; nom: string };
}

export interface EditProfileRequest {
  nom: string;
  prenom: string;
  email: string;
  phoneNumber: string;
  adresse: string;
  ville: string;
  pays: string;
  idFiliale?: string;
  dateNaissance?: string;
  photo?: string;
  CurrentPassword?: string;  // Majuscule
  NewPassword?: string;      // Majuscule

}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiBaseUrl}/account/profile`;

  // <-- Injecter AuthService dans le constructeur
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    // <-- Utiliser authService pour récupérer le token
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // <-- S'assurer que le token est correctement formaté
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching profile:', error);
        // Afficher plus de détails sur l'erreur 401 si elle persiste
        if (error.status === 401) {
          console.error('Authorization header sent:', this.getHeaders().get('Authorization'));
        }
        return throwError(() => new Error('Failed to fetch profile'));
      })
    );
  }

  updateProfile(profile: EditProfileRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.apiUrl, profile, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error updating profile:', error);
        // Afficher plus de détails sur l'erreur 401 si elle persiste
        if (error.status === 401) {
          console.error('Authorization header sent:', this.getHeaders().get('Authorization'));
        }
        return throwError(() => new Error('Failed to update profile'));
      })
    );
  }
}

