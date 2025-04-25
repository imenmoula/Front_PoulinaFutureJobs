import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable ,map, throwError} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserRole } from '../../Models/user-role.model';
import { User } from '../../Models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiUrl = `${environment.apiBaseUrl}/AppUsers`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    console.log('Token used in UserService:', token); // Debug token

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/role/${role}`, { headers: this.getHeaders() });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  // updateUser(id: string, user: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, user);
  // }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email?email=${email}`);
  }

  getRecruteurs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recruteurs`);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur côté serveur : ${error.status} - ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(() => new Error(errorMessage));
 
  }
  ///********************************************les experiences et competences ****** */
  // // POST /api/Users/{userId}/Experiences
  // addExperience(userId: string, experience: ExperienceForm): Observable<ExperienceResponse> {
  //   return this.http.post<ExperienceResponse>(`${this.apiUrl}/${userId}/Experiences`, experience);
  // }

  // // PUT /api/Users/{userId}/Experiences/{experienceId}
  // updateExperience(userId: string, experienceId: string, experience: ExperienceForm): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/${userId}/Experiences/${experienceId}`, experience);
  // }

  // // DELETE /api/Users/{userId}/Experiences/{experienceId}
  // deleteExperience(userId: string, experienceId: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${userId}/Experiences/${experienceId}`);
  // }

  // // POST /api/Users/{userId}/Competences
  // addCompetence(userId: string, competence: CandidateCompetenceForm): Observable<CandidateCompetenceResponse> {
  //   return this.http.post<CandidateCompetenceResponse>(`${this.apiUrl}/${userId}/Competences`, competence);
  // }

  // // PUT /api/Users/{userId}/Competences/{competenceId}
  // updateCompetence(userId: string, competenceId: string, competence: CandidateCompetenceForm): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/${userId}/Competences/${competenceId}`, competence);
  // }

  // DELETE /api/Users/{userId}/Competences/{competenceId}
  deleteCompetence(userId: string, competenceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/Competences/${competenceId}`);
  }
}