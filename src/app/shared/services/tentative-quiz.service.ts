// src/app/services/tentative-quiz.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CreateTentativeQuizDto, ResultatQuizDto, SoumettreTentativeDto, TentativeQuizDto } from '../../Models/quizze.model';


@Injectable({
  providedIn: 'root'
})
export class TentativeQuizService {
  private apiUrl = 'https://votre-api.com/api';

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

  createTentative(dto: CreateTentativeQuizDto): Observable<TentativeQuizDto> {
    return this.http.post<TentativeQuizDto>(`${this.apiUrl}/TentativeQuiz`, dto).pipe(
      tap(data => console.log('Tentative créée:', data)),
      catchError(this.handleError)
    );
  }

  getTentative(tentativeId: string): Observable<TentativeQuizDto> {
    return this.http.get<TentativeQuizDto>(`${this.apiUrl}/TentativeQuiz/${tentativeId}`).pipe(
      tap(data => console.log('Tentative récupérée:', data)),
      catchError(this.handleError)
    );
  }

  submitTentative(tentativeId: string, dto: SoumettreTentativeDto): Observable<ResultatQuizDto> {
    return this.http.post<ResultatQuizDto>(`${this.apiUrl}/TentativeQuiz/${tentativeId}/Soumettre`, dto).pipe(
      tap(data => console.log('Tentative soumise:', data)),
      catchError(this.handleError)
    );
  }

  abandonTentative(tentativeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/TentativeQuiz/${tentativeId}/Abandonner`, {}).pipe(
      tap(() => console.log('Tentative abandonnée')),
      catchError(this.handleError)
    );
  }

  getResultat(tentativeId: string): Observable<ResultatQuizDto> {
    return this.http.get<ResultatQuizDto>(`${this.apiUrl}/TentativeQuiz/${tentativeId}/Resultat`).pipe(
      tap(data => console.log('Résultat récupéré:', data)),
      catchError(this.handleError)
    );
  }
}