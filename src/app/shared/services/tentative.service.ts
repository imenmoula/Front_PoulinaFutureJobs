import { Injectable } from '@angular/core';
import { ResultatQuizDto, StartTentativeDto, SubmitTentativeDto, TentativeQuizDetailDto, TentativeQuizResponseDto } from '../../Models/quiz.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TentativeService {


  private apiUrl = `${environment.apiBaseUrl}/TentativeQuiz`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les tentatives d'un utilisateur
  getTentativesByUser(userId: string): Observable<TentativeQuizResponseDto[]> {
    return this.http.get<TentativeQuizResponseDto[]>(`${this.apiUrl}/User/${userId}`);
  }

  // Récupérer une tentative par son ID
  getTentativeById(id: string): Observable<TentativeQuizDetailDto> {
    return this.http.get<TentativeQuizDetailDto>(`${this.apiUrl}/${id}`);
  }

  // Démarrer une nouvelle tentative de quiz
  startTentative(startDto: StartTentativeDto): Observable<TentativeQuizResponseDto> {
    return this.http.post<TentativeQuizResponseDto>(`${this.apiUrl}/Start`, startDto);
  }

  // Soumettre les réponses d'une tentative
  submitTentative(id: string, submitDto: SubmitTentativeDto): Observable<ResultatQuizDto> {
    return this.http.post<ResultatQuizDto>(`${this.apiUrl}/${id}/Submit`, submitDto);
  }

  // Abandonner une tentative
  abandonTentative(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/Abandon`, {});
  }
}
