// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { environment } from '../../../environments/environment.development';
// import { OffreCompetence } from '../../Models/offre-competence.model';
// import { Competence } from '../../Models/competence.model';
// import { AuthService } from './auth.service';

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class OffreCompetenceService {
//   private apiUrl = `${environment.apiBaseUrl}/OffreCompetences`;

//  constructor(private http: HttpClient, private authService: AuthService) {}

//   private getAuthHeaders(): HttpHeaders {
//     const token = this.authService.getToken();
//     if (!token) {
//       throw new Error('No authentication token available');
//     }
//     return new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//   }

//    getAll(): Observable<any> {
//     return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
//       catchError(error => {
//         console.error('Error loading competences:', error);
//         if (error.status === 401) {
//           // Rediriger vers le login si non autorisé
//           this.authService.logout();
//         }
//         return throwError(error);
//       })
//     );
//   }

//   getById(idOffreEmploi: string, idCompetence: string): Observable<OffreCompetence> {
//     return this.http.get<ApiResponse<OffreCompetence>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getAuthHeaders() }).pipe(
//       map(response => response.data),
//       catchError(this.handleError)
//     );
//   }
// // getByOffreId(idOffre: string): Observable<OffreCompetence[]> {
// //   return this.http.get<ApiResponse<OffreCompetence[]>>(
// //     `${this.apiUrl}/by-offre/${idOffre}`,
// //     { headers: this.getHeaders() }
// //   ).pipe(
// //     map(response => response.data || []),
// //     catchError(this.handleError)
// //   );
// // }

// getByOffreId(idOffre: string): Observable<OffreCompetence[]> {
//   return this.http.get<ApiResponse<OffreCompetence[]>>(
//     `${this.apiUrl}/by-offre/${idOffre}`,
//     { headers: this.getAuthHeaders() }
//   ).pipe(
//     map(response => response.data || []),
//     catchError(this.handleError)
//   );
// }

// getCompetencesDisponibles(): Observable<Competence[]> {
//   return this.http.get<ApiResponse<Competence[]>>(
//     `${this.apiUrl}/competences-disponibles`,
//     { headers: this.getAuthHeaders() }
//   ).pipe(
//     map(response => response.data || []),
//     catchError(this.handleError)
//   );
// }
//   create(competence: OffreCompetence): Observable<OffreCompetence> {
//     return this.http.post<ApiResponse<OffreCompetence>>(this.apiUrl, competence, { headers: this.getAuthHeaders() }).pipe(
//       map(response => response.data),
//       catchError(this.handleError)
//     );
//   }

//   update(idOffreEmploi: string, idCompetence: string, competence: OffreCompetence): Observable<OffreCompetence> {
//     return this.http.put<ApiResponse<OffreCompetence>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, competence, { headers: this.getAuthHeaders() }).pipe(
//       map(response => response.data),
//       catchError(this.handleError)
//     );
//   }

//   delete(idOffreEmploi: string, idCompetence: string): Observable<void> {
//     return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getAuthHeaders() }).pipe(
//       map(() => undefined),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: any): Observable<never> {
//     let errorMessage = 'Une erreur est survenue';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Erreur client : ${error.error.message}`;
//     } else {
//       errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.message || error.message}`;
//       if (error.error?.detail) {
//         errorMessage += `, Détails : ${error.error.detail}`;
//       }
//     }
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }

// offre-competence.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { OffreCompetence } from '../../Models/offre-competence.model';
import { Competence } from '../../Models/competence.model';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OffreCompetenceService {
  private apiUrl = `${environment.apiBaseUrl}/OffreCompetences`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<OffreCompetence[]> {
    return this.http.get<ApiResponse<OffreCompetence[]>>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error loading competences:', error);
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  getById(idOffreEmploi: string, idCompetence: string): Observable<OffreCompetence> {
    return this.http.get<ApiResponse<OffreCompetence>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getByOffreId(idOffre: string): Observable<OffreCompetence[]> {
    return this.http.get<ApiResponse<OffreCompetence[]>>(`${this.apiUrl}/by-offre/${idOffre}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  getCompetencesDisponibles(): Observable<Competence[]> {
    return this.http.get<ApiResponse<Competence[]>>(`${this.apiUrl}/competences-disponibles`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  create(offreCompetence: OffreCompetence): Observable<OffreCompetence> {
    return this.http.post<ApiResponse<OffreCompetence>>(this.apiUrl, offreCompetence, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  update(idOffreEmploi: string, idCompetence: string, offreCompetence: OffreCompetence): Observable<OffreCompetence> {
    return this.http.put<ApiResponse<OffreCompetence>>(
      `${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, 
      offreCompetence, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  delete(idOffreEmploi: string, idCompetence: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idOffreEmploi}/${idCompetence}`, { headers: this.getAuthHeaders() }).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.message || error.message}`;
      if (error.error?.detail) {
        errorMessage += `, Détails : ${error.error.detail}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}