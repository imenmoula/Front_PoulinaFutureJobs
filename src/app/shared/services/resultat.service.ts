import { Injectable } from '@angular/core';
import { CommentaireDto, ResultatQuizDetailDto, ResultatQuizDto } from '../../Models/quiz.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResultatService {

   private apiUrl = `${environment.apiBaseUrl}/ResultatQuiz`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les résultats d'un utilisateur
  getResultatsByUser(userId: string): Observable<ResultatQuizDto[]> {
    return this.http.get<ResultatQuizDto[]>(`${this.apiUrl}/User/${userId}`);
  }

  // Récupérer tous les résultats d'un quiz
  getResultatsByQuiz(quizId: string): Observable<ResultatQuizDto[]> {
    return this.http.get<ResultatQuizDto[]>(`${this.apiUrl}/Quiz/${quizId}`);
  }

  // Récupérer un résultat par son ID
  getResultatById(id: string): Observable<ResultatQuizDetailDto> {
    return this.http.get<ResultatQuizDetailDto>(`${this.apiUrl}/${id}`);
  }

  // Ajouter ou mettre à jour un commentaire sur un résultat
  updateCommentaire(id: string, commentaireDto: CommentaireDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/Commentaire`, commentaireDto);
  }
}
