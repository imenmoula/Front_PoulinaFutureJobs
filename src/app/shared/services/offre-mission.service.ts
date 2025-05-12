import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { OffreMission } from '../../Models/offre-emploi.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OffreMissionService {
  private apiUrl = `${environment.apiBaseUrl}/OffreMissions`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getByOffreEmploi(idOffreEmploi: string): Observable<OffreMission[]> {
    const params = new HttpParams().set('IdOffreEmploi', idOffreEmploi);
    return this.http.get<ApiResponse<OffreMission[]>>(this.apiUrl, { headers: this.getHeaders(), params }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<OffreMission> {
    return this.http.get<ApiResponse<OffreMission>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  create(mission: OffreMission): Observable<OffreMission> {
    return this.http.post<ApiResponse<OffreMission>>(this.apiUrl, mission, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  update(id: string, mission: OffreMission): Observable<OffreMission> {
    return this.http.put<ApiResponse<OffreMission>>(`${this.apiUrl}/${id}`, mission, { headers: this.getHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
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