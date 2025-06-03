
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service'; // Importez AuthService

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = `${environment.apiBaseUrl}/Profile`;
  private uploadUrl = `${environment.apiBaseUrl}/fileupload/upload-profile-photo`;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Injectez AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Utilisez AuthService pour récupérer le token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Gérer l'erreur d'authentification
      console.error('Erreur d\'authentification :', error);
      this.authService.logout(); // Déconnexion
    }
    return throwError(() => error);
  }

  // Diplômes
  getAllDiplomes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/diplomes`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addDiplome(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/diplomes`, dto, { 
      headers: this.getHeaders() 
    });
  }

  updateDiplome(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/diplomes/${id}`, dto, { 
      headers: this.getHeaders() 
    });
  }

  deleteDiplome(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/diplomes/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Expériences
  getAllExperiences(): Observable<any> {
    return this.http.get(`${this.apiUrl}/experiences`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addExperience(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/experiences`, dto, { 
      headers: this.getHeaders() 
    });
  }

  updateExperience(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/experiences/${id}`, dto, { 
      headers: this.getHeaders() 
    });
  }

  deleteExperience(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/experiences/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Certificats
  getAllCertificats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/certificats`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addCertificat(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/certificats`, dto, { 
      headers: this.getHeaders() 
    });
  }

  updateCertificat(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/certificats/${id}`, dto, { 
      headers: this.getHeaders() 
    });
  }

  deleteCertificat(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/certificats/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}