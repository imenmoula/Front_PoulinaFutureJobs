import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { OffreCompetence } from '../../Models/offre-competence.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OffreCompetenceService {
  private apiUrl = `${environment.apiBaseUrl}/OffreCompetences`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAll(): Observable<OffreCompetence[]> {
    return this.http.get<ApiResponse<OffreCompetence[]>>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getById(idOffreEmploi: string, idCompetence: string): Observable<OffreCompetence> {
    return this.http.get<ApiResponse<OffreCompetence>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  create(competence: OffreCompetence): Observable<OffreCompetence> {
    return this.http.post<ApiResponse<OffreCompetence>>(this.apiUrl, competence, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  update(idOffreEmploi: string, idCompetence: string, competence: OffreCompetence): Observable<OffreCompetence> {
    return this.http.put<ApiResponse<OffreCompetence>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, competence, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  delete(idOffreEmploi: string, idCompetence: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getHeaders() }).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.message || error.message}`;
      if (error.error?.detail) {
        errorMessage += `, Détails : ${error.error.detail}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}