import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './services/auth.service';
import { Competence } from '../Models/competence.model';
import { HardSkillType, SoftSkillType } from '../Models/enums.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private apiUrl = `${environment.apiBaseUrl}/Competences`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // CRUD Operations
  getAllCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getCompetenceById(id: string): Observable<Competence> {
    return this.http
      .get<Competence>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(data => data || {} as Competence),
        catchError(error => {
          console.error(`Erreur lors de la récupération de la compétence ${id}:`, error);
          return throwError(() => new Error('Erreur lors de la récupération de la compétence'));
        })
      );
  }

  createCompetence(competence: Competence): Observable<Competence> {
    return this.http.post<Competence>(this.apiUrl, competence, { headers: this.getHeaders() });
  }

  updateCompetence(id: string, competence: Competence): Observable<Competence> {
    return this.http.put<Competence>(`${this.apiUrl}/${id}`, competence, { headers: this.getHeaders() });
  }

  deleteCompetence(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Gestion des enums
  getHardSkills(): string[] {
    return Object.values(HardSkillType);
  }

  getSoftSkills(): string[] {
    return Object.values(SoftSkillType);
  }

  // Recherche avancée
  searchCompetences(searchTerm: string): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params: { term: searchTerm }
    });
  }
}