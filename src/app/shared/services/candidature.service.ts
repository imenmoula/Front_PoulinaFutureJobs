import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CandidatureCompleteDto, CandidatureDto, UserInfoDto } from '../../Models/Candidature.model';
import { environment } from '../../../environments/environment.development';


@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private apiUrl = `${environment.apiBaseUrl}/PostulerCandidate`; // URL dynamique

  constructor(private http: HttpClient) {}
    private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
// Récupérer toutes les candidatures
  getAllCandidates(): Observable<CandidatureDto[]> {
    const headers = this.getHeaders();
    return this.http.get<CandidatureDto[]>(`${this.apiUrl}/GetAllCandidates`, { headers })
      .pipe(
      map((response: CandidatureDto[]): CandidatureDto[] => response),
      catchError(this.handleError.bind(this) as (error: any) => Observable<never>)
      );
  }

  // Rechercher les candidatures par statut de candidat
  getCandidatesByStatus(statutCandidate: string): Observable<CandidatureDto[]> {
    const headers = this.getHeaders();
    return this.http.get<CandidatureDto[]>(`${this.apiUrl}/GetCandidatesByStatus/${encodeURIComponent(statutCandidate)}`, { headers })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  // Méthode pour obtenir les en-têtes avec le token JWT
 
postuler(dto: CandidatureCompleteDto): Observable<any> {
  return this.http.post(`${this.apiUrl}`, dto, { headers: this.getHeaders() });
}

modifierCandidature(id: string, dto: CandidatureCompleteDto): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, dto, { headers: this.getHeaders() });
}

 // candidature.service.ts
// Modifier toutes les méthodes comme ceci :
// candidature.service.ts
supprimerCandidature(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, { 
    headers: this.getHeaders() // Ajoutez ceci partout
  });
}


// Corriger toutes les occurrences similaires :
getCandidature(id: string): Observable<CandidatureDto> {
  return this.http.get<CandidatureDto>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
}

  getCandidatsPourOffre(offreId: string): Observable<CandidatureDto[]> {
    return this.http.get<CandidatureDto[]>(`${this. apiUrl}/GetCandidatesForOffre/${offreId}`);
  }

  getCandidatsFiltres(offreId: string): Observable<UserInfoDto[]> {
    return this.http.get<UserInfoDto[]>(`${this. apiUrl}/GetFilteredCandidates/${offreId}`);
  }

updateStatutCandidature(id: string, statut: string): Observable<any> {
  return this.http.patch(
    `${this.apiUrl}/UpdateCandidatureStatus/${id}`, 
    { statut }, 
    { headers: this.getHeaders() }
  );
}
  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code : ${error.status}, Message : ${error.error?.error || error.message}`;
      if (error.status === 401) {
        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
      } else if (error.status === 404) {
        errorMessage = error.error?.error || 'Ressource non trouvée.';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}