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
    const token = localStorage.getItem('token'); // Vérifiez que le token est bien stocké
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
}