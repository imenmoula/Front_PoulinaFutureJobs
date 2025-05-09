

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CreateOffreEmploiRequest, OffreEmploi } from '../../Models/offre-emploi.model';
import { environment } from '../../../environments/environment.development';
import { AppUser } from '../../Models/Candidature.model';

interface ApiResponse<T> {
  message: string;
  offreEmploi?: T;
  offresEmploi?: T[];
  success?: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {
  private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
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

  create(offre: OffreEmploi): Observable<{ success: boolean, message: string, offreEmploi: OffreEmploi }> {
    const request: CreateOffreEmploiRequest = { dto: offre };
    return this.http.post<{ success: boolean, message: string, offreEmploi: OffreEmploi }>(this.apiUrl, request, { headers: this.getHeaders() });
  }

  update(id: string, offre: OffreEmploi): Observable<{ success: boolean, message: string, data: { id: string } }> {
    return this.http.put<{ success: boolean, message: string, data: { id: string } }>(`${this.apiUrl}/${id}`, offre, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}