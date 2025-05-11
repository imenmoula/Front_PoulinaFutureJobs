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
  
   getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(diplome: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, diplome, { headers: this.getHeaders() });
  }

  update(id: string, diplome: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, diplome, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  }

