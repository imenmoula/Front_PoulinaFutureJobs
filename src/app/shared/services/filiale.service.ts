// fixed code filiale service
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { Filiale } from '../../Models/filiale.model';
import { CreateFilialeDto } from '../../Models/create-filiale-dto.model';

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
    console.log('Fetching filiale with ID:', id); // Debug log
    return this.http.get<{ data: Filiale; message: string }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
        map(response => {
            if (response && response.data) {
                return response.data;
            }
            throw new Error('Données de la filiale non trouvées dans la réponse');
        }),
        catchError((error) => {
            return throwError(() => new Error(`Erreur lors de la récupération des détails de la filiale : ${error.message}`));
        })
    );
}


// Create a new filiale
// Create a new filiale using CreateFilialeDto
addFiliale(filialeData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/post`, filialeData);
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

 

// Uploader une photo
uploadPhoto(file: File): Observable<{ message: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file); // "file" doit être le même nom que dans ton backend

  return this.http.post<{ message: string; url: string }>(
    `${this.apiUrl}/upload-photo`,
    formData
  ).pipe(
    catchError(error => this.handleUploadError(error))
  );
}
// Renommer la méthode pour qu'elle corresponde à l'appel dans le composant
searchFilialesByName(nom: string): Observable<Filiale[]> {
  return this.http.get<{ data: Filiale[], message: string }>(`${this.apiUrl}/search?nom=${nom}`, { headers: this.getHeaders() })
    .pipe(
      map(response => response.data),
      catchError(error => this.handleError(error, 'Erreur lors de la recherche de filiales par nom'))
    );
}



private handleUploadError(error: any) {
  console.error('Erreur dans le service :', error);
  return throwError(() => new Error('Erreur lors de la communication avec le serveur'));

}


private handleError(error: HttpErrorResponse, message?: string): Observable<never> {
  const errorMsg = message ? `${message}: ${error.message}` : error.message;
  console.error('Erreur API:', errorMsg);
  return throwError(() => new Error(errorMsg));
}

}
