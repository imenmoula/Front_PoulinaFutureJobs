import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Competence } from '../../Models/competence.model';
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

 getAllCompetences(): Observable<Competence[]> {
    return this.http.get<{ data: Competence[] }>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur chargement compétences:', error);
        return throwError(() => new Error('Erreur lors du chargement des compétences'));
      })
    );
  }


  getCompetenceById(id: string): Observable<Competence> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(response => (response as any).competence),
      catchError(this.handleError)
    );
  }
  updateUserCompetences(userId: string, competences: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/competences`, competences);
  }

 // competence.service.ts
// getAllCompetences(): Observable<Competence[]> {
//   return this.http.get<{ data: Competence[] }>(this.apiUrl).pipe(
//     map(response => response.data),
//     catchError(this.handleError)
//   );
// }

createCompetence(competence: any): Observable<Competence> {
  return this.http.post<{ data: Competence }>(this.apiUrl, competence).pipe(
    map(response => response.data),
    catchError(this.handleError)
  );
}

  updateCompetence(id: string, competence: Competence): Observable<Competence> {
    const payload = { dto: competence };
    return this.http.put(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() }).pipe(
      map(response => (response as any).competence),
      catchError(this.handleError)
    );
  }

  deleteCompetence(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  searchCompetences(term: string): Observable<any> {
    const params = new HttpParams().set('term', term);
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders(), params })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur dans CompetenceService:', error);
    return throwError(() => new Error('Erreur lors de la recherche des compétences'));
  }
  }
