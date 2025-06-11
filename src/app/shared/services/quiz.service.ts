import { catchError, Observable, of, throwError } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { ConvocationQuizDto, FullQuizCreateDto, FullQuizResponse, FullQuizResponseDto, QuizCreateDto, QuizResponse, QuizResponseDto, QuizUpdateDto, ReponseUtilisateurCreateDto, ReponseUtilisateurDto, ResultatDetailResponse, ResultatQuizDetailDto, ResultatQuizDto, ResultatQuizResponse, SoumettreQuizDto, TentativeQuizResponseDto, TentativeStatusDto } from "../../Models/quiz.model";
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

  // Define httpOptions property for requests needing headers
  private get httpOptions() {
    return {
      headers: this.getHeaders()
    };
  }

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

  createQuiz(quiz: QuizCreateDto): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(`${this.apiUrl}`, quiz, { headers: this.getHeaders() });
  }

  createFullQuiz(quiz: FullQuizCreateDto): Observable<FullQuizResponse> {
    return this.http.post<FullQuizResponse>(`${this.apiUrl}/Full`, quiz, { headers: this.getHeaders() });
  }

  updateQuiz(id: string, quiz: QuizUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quiz, { headers: this.getHeaders() });
  }

  updateFullQuiz(id: string, quiz: FullQuizCreateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Full/${id}`, quiz, { headers: this.getHeaders() });
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
/***************************************** */
 getAvailableQuizzes(): Observable<QuizResponseDto[]> {
        return this.http.get<QuizResponseDto[]>(`${this.apiUrl}/Quiz/Actifs`)
            .pipe(
                catchError(this.handleError)
            );
    }
    // Récupérer le statut de la tentative
  getTentativeStatus(tentativeId: string): Observable<TentativeStatusDto> {
    return this.http.get<TentativeStatusDto>(`${this.apiUrl}/TentativeQuiz/Status/${tentativeId}`).pipe(
      catchError(this.handleError)
    );
  }
   

    startQuizAttempt(quizId: string): Observable<TentativeQuizResponseDto> {
        // Assurez-vous que le backend peut récupérer l'ID utilisateur via l'authentification
        const body = { quizId: quizId };
        console.warn('Appel à QuizService.startQuizAttempt - Endpoint backend POST /api/TentativeQuiz requis');
        return this.http.post<TentativeQuizResponseDto>(`${this.apiUrl}/TentativeQuiz`, body, { headers: this.getHeaders() })
            .pipe(
                catchError(this.handleError)
            );
        // Exemple de retour factice en attendant le backend:
        // import { of } from 'rxjs';
        // return of({ tentativeId: 'dummy-tentative-' + Date.now() });
    }

    saveUserAnswer(answerData: ReponseUtilisateurCreateDto): Observable<ReponseUtilisateurDto> {
        return this.http.post<ReponseUtilisateurDto>(`${this.apiUrl}/ReponseUtilisateur`, answerData, this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    submitQuizAttempt(tentativeId: string): Observable<ResultatQuizDto> {
        console.warn(`Appel à QuizService.submitQuizAttempt - Endpoint backend POST /api/TentativeQuiz/${tentativeId}/Submit requis`);
        // Le corps peut être vide si toutes les infos sont dans l'URL et le contexte serveur
        return this.http.post<ResultatQuizDto>(`${this.apiUrl}/TentativeQuiz/${tentativeId}/Submit`, {}, this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
        // Exemple de retour factice en attendant le backend:
        // import { of } from 'rxjs';
        // return of({ resultatId: 'dummy-result-' + Date.now(), score: 85, reussi: true, /* ... autres champs */ });
    }

    getQuizResult(resultatId: string): Observable<ResultatQuizDetailDto> {
        return this.http.get<ResultatQuizDetailDto>(`${this.apiUrl}/ResultatQuiz/${resultatId}`)
            .pipe(
                catchError(this.handleError)
            );
    }
    private handleError(error: any): Observable<never> {
        console.error('Une erreur est survenue dans QuizService:', error);
        // Pourrait transformer l'erreur pour la consommation par le composant
        return throwError(() => new Error('Erreur lors de la communication avec l\api Quiz; détails dans la console.'));
    }
  }
