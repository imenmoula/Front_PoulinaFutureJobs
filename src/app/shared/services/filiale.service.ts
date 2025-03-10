// fixed code filiale service
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { Filiale } from '../../../Models/filiale.model';

@Injectable({
  providedIn: 'root'
})
export class FilialeService {
  private apiUrl = `${environment.apiBaseUrl}/Filiales`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getFiliales(): Observable<Filiale[]> {
    return this.http.get<{ data: Filiale[], message: string }>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, 'Erreur lors de la récupération des filiales'))
      );
  }

  getFiliale(id: string): Observable<Filiale> {
    return this.http.get<{ data: Filiale; message: string }>(`${this.apiUrl}/${id}`).pipe(
        map(response => {
            if (response && response.data) {
                return response.data;
            }
            throw new Error('Données de la filiale non trouvées dans la réponse');
        }),
        catchError((error) => {
            console.error('Erreur API:', error);
            return throwError(() => new Error(`Erreur lors de la récupération des détails de la filiale : ${error.message}`));
        })
    );
}

  addFiliale(filiale: Filiale): Observable<Filiale> {
    return this.http.post<{ data: Filiale, message: string }>(this.apiUrl, filiale, { headers: this.getHeaders() })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error, 'Erreur lors de l\'ajout de la filiale'))
      );
  }

  updateFiliale(id: string, filiale: Filiale): Observable<void> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, filiale, { headers: this.getHeaders() })
      .pipe(
        map(() => void 0),
        catchError(error => this.handleError(error, 'Erreur lors de la mise à jour de la filiale'))
      );
  }

  deleteFiliale(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('ID invalide'));
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => this.handleError(error, 'Erreur lors de la suppression'))
      );
  }

  private handleError(error: any, message: string) {
    console.error(message, error);
    return throwError(() => new Error(message));
  }
// filiale.service.ts


// Uploader une photo
uploadPhoto(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post(`${this.apiUrl}/upload-photo`, formData).pipe(
    catchError(this.handleUploadError)
  );
}

private handleUploadError(error: any) {
  console.error('Erreur dans le service :', error);
  return throwError(() => new Error('Erreur lors de la communication avec le serveur'));
}

}
