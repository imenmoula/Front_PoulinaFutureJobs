import { catchError, Observable, of } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { ConvocationQuizDto, FullQuizCreateDto, FullQuizResponseDto, QuizCreateDto, QuizResponse, QuizResponseDto, QuizUpdateDto, ResultatDetailResponse, ResultatQuizResponse, SoumettreQuizDto } from "../../Models/quiz.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Injectable } from "@angular/core";
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `${environment.apiBaseUrl}/Quiz`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('TOKEN_KEY');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getQuizzes(): Observable<QuizResponseDto[]> {
    return this.http.get<QuizResponseDto[]>(this.apiUrl);
  }

  getQuizById(id: string): Observable<QuizResponseDto> {
    return this.http.get<QuizResponseDto>(`${this.apiUrl}/${id}`);
  }

  getFullQuizById(id: string): Observable<FullQuizResponseDto> {
    return this.http.get<FullQuizResponseDto>(`${this.apiUrl}/Full/${id}`);
  }

  createQuiz(quiz: QuizCreateDto): Observable<QuizResponseDto> {
    return this.http.post<QuizResponseDto>(this.apiUrl, quiz);
  }

  createFullQuiz(quiz: FullQuizCreateDto): Observable<FullQuizResponseDto> {
    return this.http.post<FullQuizResponseDto>(`${this.apiUrl}/Full`, quiz);
  }

  updateQuiz(id: string, quiz: QuizUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quiz);
  }

  toggleQuizStatus(id: string, estActif: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/Status`, { estActif });
  }

  deleteQuiz(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
    headers: this.getHeaders(),
    observe: 'response' // Pour avoir accès à toute la réponse
  }).pipe(
    map(response => {
      if (response.status === 204) {
        return; // Suppression réussie
      }
      throw new Error('Erreur inattendue lors de la suppression');
    }),
    catchError(error => {
      if (error.status === 400) {
        throw new Error(error.error || 'Impossible de supprimer ce quiz car il a des tentatives associées.');
      }
      throw new Error('Erreur lors de la suppression du quiz');
    })
  );
}
   searchQuizzesByTitle(title: string): Observable<QuizResponse[]> {
    return this.http.get<QuizResponse[]>(`${this.apiUrl}/Recherche`, {
      params: { titre: title },
      headers: this.getHeaders()
    }).pipe(
      debounceTime(300), // Débounce côté service
      distinctUntilChanged(),
      catchError(error => {
        console.error('Search error:', error);
        return of([]);
      })
    );
  }
  getQuizzesByOffreEmploi(offreEmploiId: string): Observable<QuizResponseDto[]> {
    return this.http.get<QuizResponseDto[]>(`${this.apiUrl}/Offre/${offreEmploiId}`);
  }

  envoyerConvocation(convocation: ConvocationQuizDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/EnvoyerConvocation`, convocation);
  }

  soumettreQuiz(soumission: SoumettreQuizDto): Observable<ResultatQuizResponse> {
    return this.http.post<ResultatQuizResponse>(`${this.apiUrl}/Soumettre`, soumission);
  }

  getResultatQuiz(tentativeId: string): Observable<ResultatDetailResponse> {
    return this.http.get<ResultatDetailResponse>(`${this.apiUrl}/Resultats/${tentativeId}`);
  }
}