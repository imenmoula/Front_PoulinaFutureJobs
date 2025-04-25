// src/app/shared/services/candidateur-shared.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Candidature } from '../../Models/Candidature.model';
import { AuthService } from './auth.service';

// Export the interface


@Injectable({
  providedIn: 'root'
})
export class CandidateurSharedService {
  private apiUrl = `${environment.apiBaseUrl}/Candidatures`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Helper to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getCandidatureById(id: string): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateCandidatureStatus(id: string, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, `"${status}"`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
  deleteCandidature(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  downloadCv(userId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-cv/${userId}`, { responseType: 'blob' });
  }
// Update candidature status

  // POST /api/Candidatures
  // createCandidature(candidature: CandidatureForm): Observable<CandidatureResponse> {
  //   return this.http.post<CandidatureResponse>(this.apiUrl, candidature);
  // }

  // // PUT /api/Candidatures/{id}
  // updateCandidature(id: string, candidature: CandidatureForm): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/${id}`, candidature);
  // }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur: ${error.status} - ${error.error.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}