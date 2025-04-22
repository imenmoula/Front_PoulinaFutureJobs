import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CandidatureForm } from '../../Models/candidature-form.model';
import { throwError as rxjsThrowError } from 'rxjs';
import { AuthService } from './auth.service';
import { OffreEmploiService } from './offre-emploi.service';
import { CompetenceService } from './competence.service';

interface Candidature {
  idCandidature: string;
  offreId: string;
  messageMotivation: string;
  statut: string;
  appUserId: string;
  fullName: string;
  nom: string;
  prenom: string;
  photo: string;
  dateNaissance: string;
  adresse: string;
  ville: string;
  pays: string;
  phone: string;
  niveauEtude: string;
  diplome: string;
  universite: string;
  specialite: string;
  cv: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  entreprise: string;
  poste: string;
  userStatut: string;
  experiences: Experience[];
  competences: Competence[];
}

interface Experience {
  poste: string;
  nomEntreprise: string;
  description: string;
  competenceAcquise: string;
  dateDebut: string;
  dateFin: string;
  certificats: Certificat[];
}

interface Certificat {
  nom: string;
  dateObtention: string;
  organisme: string;
  description: string;
  urlDocument: string;
}

interface Competence {
  competenceNom: string;
  niveauPossede: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateurSharedService {
  private apiUrl = `${environment.apiBaseUrl}/Candidature`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private offreService: OffreEmploiService,
    private competenceService: CompetenceService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Récupérer toutes les candidatures
  getAllCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Récupérer une candidature par ID
  getCandidatureById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle candidature
  createCandidature(candidature: Candidature): Observable<ApiResponse<Candidature>> {
    return this.http.post<ApiResponse<Candidature>>(this.apiUrl, candidature, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Mettre à jour une candidature
  updateCandidature(id: string, candidature: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, candidature);
  }

  // Mettre à jour le statut d'une candidature
  updateCandidatureStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.title || error.message}`;
      if (error.error?.errors) {
        errorMessage += `, Détails : ${JSON.stringify(error.error.errors)}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

