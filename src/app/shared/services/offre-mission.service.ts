// src/app/shared/services/offre-mission.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

interface OffreMission {
  idOffreEmploi: string; // Doit correspondre à Guid, mais converti en string pour Angular
  idOffreMission?: string; // Optionnel, généré par le backend
  descriptionMission: string; // Aligné avec le backend
  priorite?: number; // Optionnel, aligné avec le backend
}
interface ApiResponse<T> {
  message: string;
  mission?: T; // Optional, as the response might include a mission object
}

@Injectable({
  providedIn: 'root'
})
export class OffreMissionService {
  private apiUrl = `${environment.apiBaseUrl}/OffreMissions`;

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

  getByOffreEmploi(idOffreEmploi: string): Observable<any> {
    const params = new HttpParams().set('IdOffreEmploi', idOffreEmploi);
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders(), params });
  }

  getById(id: string): Observable<OffreMission> {
    return this.http.get<OffreMission>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

 // src/app/shared/services/offre-mission.service.ts
create(mission: OffreMission): Observable<any> {
  return this.http.post<any>(this.apiUrl, mission, { headers: this.getHeaders() }).pipe(
    map(response => response.data || response), // Extraire 'data' de la réponse
    catchError(error => {
      console.error('Error creating mission', error);
      return throwError(() => new Error('Failed to create mission'));
    })
  );
}

  update(id: string, mission: OffreMission): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mission, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}