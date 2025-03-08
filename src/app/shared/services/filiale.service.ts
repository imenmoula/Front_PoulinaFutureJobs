// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { environment } from '../../../environments/environment.development';
// import { Filiale } from '../../../Models/filiale.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class FilialeService {
//   private apiUrl = `${environment.apiBaseUrl}/Filiales`;

//   constructor(private http: HttpClient) {}

// /*************  ✨ Codeium Command ⭐  *************/
//   /**
//    * Retourne les headers HTTP pour les requ tes
//    * 
//    * Si un token est pr sent dans le stockage local, il est ajout  comme ent te d'en-t te 'Authorization'
//    * 
//    * @returns {HttpHeaders}
//    */
// /******  b9e207c1-d970-4f32-810c-ebfc20be76b4  *******/  private getHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : ''
//     });
//   }
//   getFiliales(): Observable<Filiale[]> {
//     return this.http.get<{ data: Filiale[], message: string }>(this.apiUrl, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(error => {
//           console.error('Error fetching filiales:', error);
//           return throwError(() => new Error('Erreur lors de la récupération des filiales'));
//         })
//       );
//   }

//   GetFiliale(id: string): Observable<Filiale> {
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.get<{ data: Filiale, message: string }>(url, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(error => {
//           console.error('Error fetching filiale:', error);
//           return throwError(() => new Error('Erreur lors de la récupération de la filiale'));
//         })
//       );
//   }

//   PostFiliale(filiale: Filiale): Observable<Filiale> {
//     return this.http.post<{ data: Filiale, message: string }>(this.apiUrl, filiale, { headers: this.getHeaders() })
//       .pipe(
//         map(response => response.data),
//         catchError(error => {
//           console.error('Error adding filiale:', error);
//           return throwError(() => new Error('Erreur lors de l\'ajout de la filiale'));
//         })
//       );
//   }

//   PutFiliale(id: string, filiale: Filiale): Observable<void> {
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.put<{ message: string }>(url, filiale, { headers: this.getHeaders() })
//       .pipe(
//         map(() => void 0),
//         catchError(error => {
//           console.error('Error updating filiale:', error);
//           return throwError(() => new Error('Erreur lors de la mise à jour de la filiale'));
//         })
//       );
//   }
//   deleteFiliale(id: string): Observable<void> {
//     if (!id || id.length !== 36) { // Vérification du format GUID
//       console.error('ID invalide:', id);
//       return throwError(() => new Error('ID invalide'));
//     }
  
//     const url = `${this.apiUrl}/${id}`;
//     // console.log('URL de suppression:', url);
  
//     return this.http.delete<void>(url)
//       .pipe(
//         catchError(error => {
//           console.error('Erreur lors de la suppression:', error);
//           return throwError(() => new Error('Erreur lors de la suppression'));
//         })
//       );
//   }
  
// }

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
    return this.http.get<Filiale>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        // Loggez l'erreur pour l'analyse, si nécessaire
        console.error('Erreur API:', error);

        // Retournez un observable d'erreur avec un message d'erreur personnalisé
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

uploadPhoto(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('photo', file);

  return this.http.post<{ photoUrl: string }>(`${this.apiUrl}/upload`, formData, {
    headers: this.getHeaders(),
  }).pipe(
    map(response => response.photoUrl),
    catchError(error => {
      console.error('Error uploading photo:', error);
      return throwError(() => new Error('Erreur lors de l\'upload de la photo'));
    })
  );
}


}
