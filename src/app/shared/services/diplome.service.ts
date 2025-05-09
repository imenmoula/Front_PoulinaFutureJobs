import { Injectable } from '@angular/core';
import { Diplome } from '../../Models/offre-emploi.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiplomeService {

    private apiUrl = `${environment.apiBaseUrl}/Diplomes`;
    constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
  
    getAll(): Observable<Diplome[]> {
      return this.http.get<Diplome[]>(this.apiUrl, { headers: this.getHeaders() });
    }
  
  
    getById(id: string): Observable<Diplome> {
      return this.http.get<Diplome>(`${this.apiUrl}/${id}`);
    }
  
    create(diplome: Diplome): Observable<Diplome> {
      return this.http.post<Diplome>(this.apiUrl, diplome, { headers: this.getHeaders() });
    }
  
    update(id: string, diplome: Diplome): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, diplome, { headers: this.getHeaders() });
    }
  
    delete(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
  }

