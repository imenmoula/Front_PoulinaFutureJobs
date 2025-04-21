import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CandidatureForm } from '../../Models/candidature-form.model';
import { throwError as rxjsThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateurSharedService {
  private apiUrl = `${environment.apiBaseUrl}/Candidature`;

  constructor(private http: HttpClient) {}

  getHttpOptions() {
    const token = localStorage.getItem('token');
    console.log('Token récupéré :', token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  addCandidature(candidature: CandidatureForm): Observable<any> {
    return this.http.post<any>(this.apiUrl, candidature, this.getHttpOptions()).pipe(
      tap(response => console.log('Candidature added:', response)),
      catchError(this.handleError)
    );
  }

  getCandidatures(offreId?: string): Observable<any[]> {
    const url = offreId ? `${this.apiUrl}?offreId=${offreId}` : this.apiUrl;
    return this.http.get<any[]>(url, this.getHttpOptions()).pipe(
      tap(response => console.log('Candidatures fetched:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Erreur du serveur: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

function throwError(arg0: () => Error) {
  return rxjsThrowError(arg0());
}

