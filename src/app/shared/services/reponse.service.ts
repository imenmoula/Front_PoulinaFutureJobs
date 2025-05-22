// src/app/services/reponse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ReponseCreateDto, ReponseResponseDto, ReponseUpdateDto } from '../../Models/quiz.model';

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

  // getReponses(quizId: string, questionId: string): Observable<ReponseDto[]> {
  //   return this.http.get<ReponseDto[]>(`${this.apiUrl}/Reponses?quizId=${quizId}&questionId=${questionId}`).pipe(
  //     tap(data => console.log('Réponses récupérées:', data)),
  //     catchError(this.handleError)
  //   );
  // }
  
  // Récupérer toutes les réponses d'une question
  getReponsesByQuestion(questionId: string): Observable<ReponseResponseDto[]> {
    return this.http.get<ReponseResponseDto[]>(`${this.apiUrl}/Question/${questionId}`);
  }

  // Récupérer une réponse par son ID
  getReponseById(id: string): Observable<ReponseResponseDto> {
    return this.http.get<ReponseResponseDto>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle réponse
  createReponse(reponse: ReponseCreateDto): Observable<ReponseResponseDto> {
    return this.http.post<ReponseResponseDto>(this.apiUrl, reponse);
  }

  // Mettre à jour une réponse
  updateReponse(id: string, reponse: ReponseUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, reponse);
  }

  // Supprimer une réponse
  deleteReponse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Réordonner les réponses d'une question
  reorderReponses(questionId: string, reponseIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Question/${questionId}/Reorder`, { reponseIds });
  }
}
