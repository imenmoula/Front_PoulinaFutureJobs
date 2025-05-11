

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CreateOffreEmploiRequest, OffreEmploi } from '../../Models/offre-emploi.model';
import { environment } from '../../../environments/environment.development';
import { AppUser } from '../../Models/Candidature.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {
  private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;

  constructor(private http: HttpClient) { }
// In offre-emploi.service.ts
private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
getToken(): string | null {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  console.log('Token récupéré :', token);
  return token;
}
  getAll(): Observable<{ success: boolean, message: string, offresEmploi: OffreEmploi[] }> {
    return this.http.get<{ success: boolean, message: string, offresEmploi: OffreEmploi[] }>(this.apiUrl);
  }

  getById(id: string): Observable<{ success: boolean, message: string, offreEmploi: OffreEmploi }> {
    return this.http.get<{ success: boolean, message: string, offreEmploi: OffreEmploi }>(`${this.apiUrl}/${id}`);
  }

  getByFiliale(idFiliale: string): Observable<{ success: boolean, message: string, offresEmploi: OffreEmploi[] }> {
    return this.http.get<{ success: boolean, message: string, offresEmploi: OffreEmploi[] }>(`${this.apiUrl}/by-filiale/${idFiliale}`);
  }

  search(titrePoste?: string, specialite?: string, typeContrat?: string, statut?: string, modeTravail?: string, idFiliale?: string): Observable<{ success: boolean, message: string, offresEmploi: OffreEmploi[] }> {
    let params: { [key: string]: string } = {};
    if (titrePoste) params['titrePoste'] = titrePoste;
    if (specialite) params['specialite'] = specialite;
    if (typeContrat) params['typeContrat'] = typeContrat;
    if (statut) params['statut'] = statut;
    return this.http.get<{ success: boolean, message: string, offresEmploi: OffreEmploi[] }>(`${this.apiUrl}/search`, { params });
  }

  getRecruteurs(): Observable<{ success: boolean, message: string, recruteurs: AppUser[] }> {
    return this.http.get<{ success: boolean, message: string, recruteurs: AppUser[] }>(`${this.apiUrl}/recruteurs`, { headers: this.getHeaders() });
  }

  addOffre(offre: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, offre, { headers: this.getHeaders() }).pipe(
    tap(response => console.log('Offre ajoutée:', response)),
    catchError(error => {
      console.error('Erreur lors de l\'ajout de l\'offre:', error);
      return throwError(() => new Error(error.message || 'Erreur serveur'));
    })
  );
}

  update(id: string, offre: OffreEmploi): Observable<{ success: boolean, message: string, data: { id: string } }> {
    return this.http.put<{ success: boolean, message: string, data: { id: string } }>(`${this.apiUrl}/${id}`, offre, { headers: this.getHeaders() });
  }

  deleteOffre(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  // Récupère les statuts depuis l'API .NET Core
  getStatuts(): Observable<string[]> {
    return this.http.get<ApiResponse<{ value: number; name: string }[]>>(`${this.apiUrl}/Statuts`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data.map(s => s.name)),
        catchError(this.handleError)
      );
  }

  // Récupère les types de contrat depuis l'API .NET Core
  getTypesContrat(): Observable<string[]> {
    return this.http.get<ApiResponse<{ value: number; name: string }[]>>(`${this.apiUrl}/TypesContrat`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data.map(t => t.name)),
        catchError(this.handleError)
      );
  }

  // Récupère les modes de travail depuis l'API .NET Core
  getModesTravail(): Observable<string[]> {
    return this.http.get<ApiResponse<{ value: number; name: string }[]>>(`${this.apiUrl}/ModesTravail`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data.map(m => m.name)),
        catchError(this.handleError)
      );
  }

  // Récupère les niveaux requis depuis l'API .NET Core
  getNiveauxRequis(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/NiveauxRequis`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
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