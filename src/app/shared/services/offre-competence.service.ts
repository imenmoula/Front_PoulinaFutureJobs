import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

interface OffreCompetence {
  idOffreEmploi: string;
  idCompetence: string;
  niveauRequis: string;
  competence: {
    id: string;
    nom: string;
    description: string;
    estTechnique: boolean;
    estSoftSkill: boolean;
  };
}

interface ApiResponse<T> {
  message: string;
  competences?: T[];
  competence?: T;
}

@Injectable({
  providedIn: 'root'
})
export class OffreCompetenceSharedService {
  private apiUrl = `${environment.apiBaseUrl}/OffreCompetences`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Récupérer les compétences pour une offre spécifique
  getCompetencesByOffre(offreId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/offre/${offreId}`);
  }
  // getCompetencesByOffre(offreId: string): Observable<OffreCompetence[]> {
  //   return this.http.get<ApiResponse<OffreCompetence>>(`${this.apiUrl}/offre/${offreId}`, { headers: this.getHeaders() })
  //     .pipe(
  //       map(response => response.competences || []),
  //       catchError(this.handleError)
  //     );
  // }

  // Ajouter une compétence à une offre
  addCompetenceToOffre(dto: any): Observable<OffreCompetence> {
    return this.http.post<ApiResponse<OffreCompetence>>(this.apiUrl, dto, { headers: this.getHeaders() })
      .pipe(
        map(response => response.competence || {} as OffreCompetence),
        catchError(this.handleError)
      );
  }

  // Mettre à jour une compétence associée à une offre
  updateOffreCompetence(idOffreEmploi: string, idCompetence: string, dto: any): Observable<OffreCompetence> {
    return this.http.put<ApiResponse<OffreCompetence>>(
      `${this.apiUrl}/${idOffreEmploi}/${idCompetence}`,
      dto,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.competence || {} as OffreCompetence),
      catchError(this.handleError)
    );
  }

  // Supprimer une compétence d'une offre
  deleteOffreCompetence(idOffreEmploi: string, idCompetence: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${idOffreEmploi}/${idCompetence}`,
      { headers: this.getHeaders() }
    ).pipe(
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