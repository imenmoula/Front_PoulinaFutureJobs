// src/app/services/reponse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ReponseDto } from '../../Models/quizze.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = `${environment.apiBaseUrl}/`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('TOKEN_KEY');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code: ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getReponses(quizId: string, questionId: string): Observable<ReponseDto[]> {
    return this.http.get<ReponseDto[]>(`${this.apiUrl}/Reponses?quizId=${quizId}&questionId=${questionId}`).pipe(
      tap(data => console.log('Réponses récupérées:', data)),
      catchError(this.handleError)
    );
  }
}