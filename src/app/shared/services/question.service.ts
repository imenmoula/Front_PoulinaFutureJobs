// src/app/services/question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { QuestionCreateDto, QuestionResponseDto, QuestionUpdateDto } from '../../Models/quiz.model';

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

 // Récupérer toutes les questions d'un quiz
  getQuestionsByQuiz(quizId: string): Observable<QuestionResponseDto[]> {
    return this.http.get<QuestionResponseDto[]>(`${this.apiUrl}/Quiz/${quizId}`);
  }

  // Récupérer une question par son ID
  getQuestionById(id: string): Observable<QuestionResponseDto> {
    return this.http.get<QuestionResponseDto>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle question
  createQuestion(question: QuestionCreateDto): Observable<QuestionResponseDto> {
    return this.http.post<QuestionResponseDto>(this.apiUrl, question);
  }

  // Mettre à jour une question
  updateQuestion(id: string, question: QuestionUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, question);
  }

  // Supprimer une question
  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Réordonner les questions d'un quiz
  reorderQuestions(quizId: string, questionIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Quiz/${quizId}/Reorder`, { questionIds });
  }
}