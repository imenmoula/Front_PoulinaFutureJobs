// src/app/services/poste.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Poste, PosteCreateDto, PosteUpdateDto } from '../../Models/offre-emploi.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  offresEmploi?: T[];
}

@Injectable({
  providedIn: 'root'
})
export class PosteService {
  private apiUrl = `${environment.apiBaseUrl}/Postes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  // Récupérer tous les postes
  getAll(): Observable<Poste[]> {
    return this.http.get<ApiResponse<Poste[]>>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  // Récupérer un poste par ID
 getById(id: string): Observable<Poste> {
  return this.http.get<ApiResponse<Poste>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
    map(response => {
      if (!response.data) {
        throw new Error('Poste not found');
      }
      return response.data;
    }),
    catchError(this.handleError)
  );
}

  // Récupérer les postes par ID d'offre d'emploi
  getByOffreId(idOffre: string): Observable<Poste[]> {
    return this.http.get<ApiResponse<Poste[]>>(`${this.apiUrl}/by-offre/${idOffre}`, { headers: this.getHeaders() }).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  // Créer un nouveau poste
  create(poste: PosteCreateDto): Observable<Poste> {
  return this.http.post<ApiResponse<Poste>>(this.apiUrl, poste, { headers: this.getHeaders() }).pipe(
    map(response => response.data ?? {} as Poste),
    catchError(this.handleError)
  );
}

update(id: string, poste: PosteUpdateDto): Observable<Poste> {
  return this.http.put<ApiResponse<Poste>>(`${this.apiUrl}/${id}`, poste, { headers: this.getHeaders() }).pipe(
    map(response => response.data ?? {} as Poste),
    catchError(this.handleError)
  );
}

  // Supprimer un poste
  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
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