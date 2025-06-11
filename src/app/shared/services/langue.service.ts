import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { OffreLangue } from '../../Models/offre-emploi.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class LangueService {
  private apiUrl = `${environment.apiBaseUrl}/OffreLangues`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<OffreLangue[]> {
    return this.http.get<OffreLangue[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<OffreLangue> {
    return this.http.get<OffreLangue>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  create(langue: OffreLangue): Observable<OffreLangue> {
    return this.http.post<ApiResponse<OffreLangue>>(this.apiUrl, langue, { headers: this.getHeaders() }).pipe(
      map(response => response.data as OffreLangue),
      catchError(this.handleError)
    );
  }

  update(id: string, langue: OffreLangue): Observable<OffreLangue> {
    return this.http.put<ApiResponse<OffreLangue>>(`${this.apiUrl}/${id}`, langue, { headers: this.getHeaders() }).pipe(
      map(response => response.data as OffreLangue),
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
getByOffreId(idOffre: string): Observable<OffreLangue[]> {
  return this.http.get<ApiResponse<OffreLangue[]>>(
    `${this.apiUrl}/by-offre/${idOffre}`,
    { headers: this.getHeaders() }
  ).pipe(
    map(response => response.data || []),
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