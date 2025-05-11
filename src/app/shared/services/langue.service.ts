import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { OffreLangue } from '../../Models/offre-emploi.model';
import { Langue } from '../../Models/enums.model';

interface ApiResponse<T> {
  message: string;
  langues?: T[];
  langue?: T;
}

@Injectable({
  providedIn: 'root'
})
export class LangueService {
  private apiUrl = `${environment.apiBaseUrl}/OffreLangues`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

 getAll(): Observable<OffreLangue[]> {
    return this.http.get<OffreLangue[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<OffreLangue> {
    return this.http.get<OffreLangue>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(langue: OffreLangue): Observable<any> {
    return this.http.post<any>(this.apiUrl, langue, { headers: this.getHeaders() });
  }

  update(id: string, langue: OffreLangue): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, langue, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}