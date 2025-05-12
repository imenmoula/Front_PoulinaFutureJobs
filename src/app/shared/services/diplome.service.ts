import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { Diplome } from '../../Models/offre-emploi.model';


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class DiplomeService {
  private apiUrl = `${environment.apiBaseUrl}/Diplomes`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAll(): Observable<ApiResponse<Diplome[]>> {
    return this.http.get<ApiResponse<Diplome[]>>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<ApiResponse<Diplome>> {
    return this.http.get<ApiResponse<Diplome>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  create(diplome: Diplome): Observable<ApiResponse<Diplome>> {
    return this.http.post<ApiResponse<Diplome>>(this.apiUrl, diplome, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, diplome: Diplome): Observable<ApiResponse<Diplome>> {
    return this.http.put<ApiResponse<Diplome>>(`${this.apiUrl}/${id}`, diplome, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
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