// src/app/services/filiale.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Filiale } from '../../../Models/filiale.model';


@Injectable({
  providedIn: 'root'
})
export class FilialeService {
  private apiUrl = `${environment.apiBaseUrl}/Filiales`; // Utilisez l'environnement ici

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_JWT_TOKEN' })
  };

  constructor(private http: HttpClient) {}

  getFiliales(): Observable<Filiale[]> {
    return this.http.get<Filiale[]>(this.apiUrl, this.httpOptions);
  }

  getFilialeById(id: string): Observable<Filiale> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Filiale>(url, this.httpOptions);
  }
  addFiliale(filiale: Filiale): Observable<Filiale> {
    return this.http.post<Filiale>(this.apiUrl, filiale, this.httpOptions);
  }

  updateFiliale(id: string, filiale: Filiale): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, filiale, this.httpOptions);
  }

  deleteFiliale(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
  uploadImage(id: string, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}/uploadImage`;
    return this.http.post(url, formData, {
        headers: new HttpHeaders({ 'Authorization': 'Bearer YOUR_JWT_TOKEN' })
      });
    }
        
}