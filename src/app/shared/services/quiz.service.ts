// src/app/services/quiz.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CreateFullQuizDto, QuizDto, QuizFullDto } from '../../Models/quizze.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `${environment.apiBaseUrl}/Quiz`;

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

  getQuizzes(): Observable<QuizDto[]> {
    return this.http.get<QuizDto[]>(`${this.apiUrl}/Quiz`).pipe(
      tap(data => console.log('Quizzes récupérés:', data)),
      catchError(this.handleError)
    );
  }

  getQuiz(quizId: string): Observable<QuizDto> {
    return this.http.get<QuizDto>(`${this.apiUrl}/Quiz/${quizId}`).pipe(
      tap(data => console.log('Quiz récupéré:', data)),
      catchError(this.handleError)
    );
  }

  createFullQuiz(dto: CreateFullQuizDto): Observable<QuizFullDto> {
    return this.http.post<QuizFullDto>(`${this.apiUrl}/Quiz/Full`, dto).pipe(
      tap(data => console.log('Quiz complet créé:', data)),
      catchError(this.handleError)
    );
  }
}