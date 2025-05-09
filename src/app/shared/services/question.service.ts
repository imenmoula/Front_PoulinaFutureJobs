// src/app/services/question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { QuestionDto } from '../../Models/quizze.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
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

  getQuestions(quizId: string): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(`${this.apiUrl}/Questions?quizId=${quizId}`).pipe(
      tap(data => console.log('Questions récupérées:', data)),
      catchError(this.handleError)
    );
  }
}