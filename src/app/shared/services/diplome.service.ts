import { AuthService } from './auth.service';
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

  constructor(private http: HttpClient , private authService: AuthService) {}

 private getAuthHeader(): HttpHeaders {
  const token = this.authService.getToken();
  if (!token) {
    console.error('No token available');
    this.authService.logout(); // Redirige vers la page de login
    throw new Error('Authentication required');
  }
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
}

 getAll(): Observable<any> {
  return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeader() }).pipe(
    catchError(error => {
      if (error.status === 401) {
        this.authService.logout();
      }
      return throwError(error);
    })
  );
}

  getById(id: string): Observable<ApiResponse<Diplome>> {
    return this.http.get<ApiResponse<Diplome>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeader() }).pipe(
      catchError(this.handleError)
    );
  }

  create(diplome: Diplome): Observable<ApiResponse<Diplome>> {
    return this.http.post<ApiResponse<Diplome>>(this.apiUrl, diplome, { headers: this.getAuthHeader() }).pipe(
      catchError(this.handleError)
    );
  }
getByOffreId(idOffre: string): Observable<Diplome[]> {
  return this.http.get<ApiResponse<Diplome[]>>(
    `${this.apiUrl}/by-offre/${idOffre}`,
    { headers: this.getAuthHeader() }
  ).pipe(
    map(response => response.data || []),
    catchError(this.handleError)
  );
}
  update(id: string, diplome: Diplome): Observable<ApiResponse<Diplome>> {
    return this.http.put<ApiResponse<Diplome>>(`${this.apiUrl}/${id}`, diplome, { headers: this.getAuthHeader() }).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeader() }).pipe(
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