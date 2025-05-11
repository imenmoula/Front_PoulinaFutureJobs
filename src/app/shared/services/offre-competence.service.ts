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
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OffreCompetenceSharedService {
  private apiUrl = `${environment.apiBaseUrl}/JobBoard/OffreCompetences`;

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

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(idOffreEmploi: string, idCompetence: string): Observable<OffreCompetence> {
    return this.http.get<OffreCompetence>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getHeaders() });
  }

  create(competence: OffreCompetence): Observable<any> {
    return this.http.post<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  update(idOffreEmploi: string, idCompetence: string, competence: OffreCompetence): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, competence, { headers: this.getHeaders() });
  }

  delete(idOffreEmploi: string, idCompetence: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getHeaders() });
  }

  
}