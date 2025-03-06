import { Data } from './../../../../node_modules/memfs/lib/fsa/types.d';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Filiale } from '../../../Models/filiale.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FilialeService {
  private apiUrl = `${environment.apiBaseUrl}/Filiales`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // Récupérer le token stocké
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Injecter dynamiquement le token
      })
    };
  }

  getFiliales(): Observable<Filiale[]> {
    return this.http.get<{ data: Filiale[] }>(this.apiUrl, this.getHttpOptions())
    .pipe(map(response => response.data));
  }
  
  addFiliale(filiale: Filiale): Observable<Filiale> {
    return this.http.post<Filiale>(this.apiUrl, filiale, this.getHttpOptions());
  }

  updateFiliale(id: string, filiale: Filiale): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, filiale, this.getHttpOptions());
  }

  deleteFiliale(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.getHttpOptions());
  }
}
