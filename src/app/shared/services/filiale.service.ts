import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Filiale } from '../../../Models/filiale.model';

@Injectable({
  providedIn: 'root'
})
export class FilialeService {
  private apiUrl = `${environment.apiBaseUrl}/Filiales`;

  constructor(private http: HttpClient) {}

  getFiliales(): Observable<Filiale[]> {
    return this.http.get<Filiale[]>(this.apiUrl);
  }

  getFiliale(id: string): Observable<Filiale> {
    return this.http.get<Filiale>(`${this.apiUrl}/${id}`);
  }

  createFiliale(filiale: Filiale): Observable<Filiale> {
    return this.http.post<Filiale>(this.apiUrl, filiale);
  }

  updateFiliale(id: string, filiale: Filiale): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, filiale);
  }

  deleteFiliale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}