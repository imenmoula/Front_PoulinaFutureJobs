// 
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { CreateOffreEmploiRequest, OffreEmploi } from '../../Models/offre-emploi.model';
import { Recruiter } from '../../Models/recruiter.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  offresEmploi?: T[];
  offreEmploi?: T;
  data?: T | T[];
  recruteurs?: Recruiter[];
}

@Injectable({ providedIn: 'root' })
export class OffreEmploiService{
  private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;

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

  // Toutes les méthodes utilisent maintenant getHeaders()

  getAll(): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(this.apiUrl, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.offresEmploi || []),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<OffreEmploi> {
    return this.http.get<ApiResponse<OffreEmploi>>(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.offreEmploi || {} as OffreEmploi),
      catchError(this.handleError)
    );
  }

  getByFiliale(idFiliale: string): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(`${this.apiUrl}/by-filiale/${idFiliale}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.offresEmploi || []),
      catchError(this.handleError)
    );
  }

  getOffresByRecruteurOfFiliale(idFiliale: string): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(`${this.apiUrl}/by-recruteur-filiale/${idFiliale}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.offresEmploi || []),
      catchError(this.handleError)
    );
  }

  toggleActivation(id: string): Observable<{ isActive: boolean }> {
    return this.http.patch<ApiResponse<{ isActive: boolean }>>(
      `${this.apiUrl}/${id}/toggle-activation`,
      null,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.data && 'isActive' in response.data) {
          return response.data;
        } else {
          throw new Error('Invalid response data');
        }
      }),
      catchError(this.handleError)
    );
  }

  getStatistics(): Observable<any> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/statistiques`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getSpecialites(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/specialites`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getNiveauxExperience(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/niveaux-experience`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  search(
    titrePoste?: string, 
    specialite?: string, 
    typeContrat?: string, 
    statut?: string, 
    niveauExperienceRequis?: string, 
    idFiliale?: string
  ): Observable<OffreEmploi[]> {
    let params = new HttpParams();
    if (titrePoste) params = params.set('titrePoste', titrePoste);
    if (specialite) params = params.set('specialite', specialite);
    if (typeContrat) params = params.set('typeContrat', typeContrat);
    if (statut) params = params.set('statut', statut);
    if (niveauExperienceRequis) params = params.set('niveauExperienceRequis', niveauExperienceRequis);
    if (idFiliale) params = params.set('idFiliale', idFiliale);
    
    return this.http.get<ApiResponse<OffreEmploi>>(`${this.apiUrl}/search`, { 
      headers: this.getHeaders(), 
      params 
    }).pipe(
      map(response => response.offresEmploi || []),
      catchError(this.handleError)
    );
  }

  getRecruitersSimple(): Observable<Recruiter[]> {
    return this.http.get<any>(`${this.apiUrl}/recruteurs`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => {
        if (response.success) {
          return response.recruteurs.map((r: any) => ({
            id: r.id,
            fullName: r.fullName,
            email: r.email
          }));
        }
        throw new Error(response.message || 'Erreur inconnue');
      }),
      catchError(error => {
        console.error('Error fetching recruiters:', error);
        return throwError(() => new Error('Failed to load recruiters'));
      })
    );
  }

  addOffre(offre: CreateOffreEmploiRequest): Observable<OffreEmploi> {
    return this.http.post<ApiResponse<OffreEmploi>>(this.apiUrl, offre, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.data as OffreEmploi),
      catchError(this.handleError)
    );
  }

  update(id: string, offre: OffreEmploi): Observable<{ id: string }> {
    return this.http.put<ApiResponse<{ id: string }>>(`${this.apiUrl}/${id}`, offre, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.data as { id: string }),
      catchError(this.handleError)
    );
  }

  deleteOffre(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getStatuts(): Observable<string[]> {
    return this.http.get<ApiResponse<{ value: number; name: string }[]>>(`${this.apiUrl}/Statuts`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => (response.data as { value: number; name: string }[]).map(s => s.name)),
      catchError(this.handleError)
    );
  }

  getTypesContrat(): Observable<string[]> {
    return this.http.get<ApiResponse<{ value: number; name: string }[]>>(`${this.apiUrl}/TypesContrat`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => (response.data as { value: number; name: string }[]).map(t => t.name)),
      catchError(this.handleError)
    );
  }

  getModesTravail(): Observable<string[]> {
    return this.http.get<ApiResponse<{ value: number; name: string }[]>>(`${this.apiUrl}/ModesTravail`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => (response.data as { value: number; name: string }[]).map(m => m.name)),
      catchError(this.handleError)
    );
  }

  getNiveauxRequis(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/NiveauxRequis`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.data as string[]),
      catchError(this.handleError)
    );
  }

  setActiveStatus(id: string, isActive: boolean): Observable<OffreEmploi> {
    return this.http.patch<ApiResponse<OffreEmploi>>(
      `${this.apiUrl}/${id}/set-active`,
      { isActive },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data as OffreEmploi),
      catchError(this.handleError)
    );
  }

  filterByStatut(statut: string): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(
      `${this.apiUrl}/filter-by-statut/${statut}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.offresEmploi || []),
      catchError(this.handleError)
    );
  }

  getByRecruteur(idRecruteur: string): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(`${this.apiUrl}/by-recruteur/${idRecruteur}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.offresEmploi || []),
      catchError(this.handleError)
    );
  }

  getByConnectedRecruteur(): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(
      `${this.apiUrl}/by-connected-recruteur`, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.offresEmploi || []),
      catchError(error => {
        if (error.status === 401) {
          return throwError(() => new Error('SESSION_EXPIRED'));
        }
        return throwError(() => error);
      })
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