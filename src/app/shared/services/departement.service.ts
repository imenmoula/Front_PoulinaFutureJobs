import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import de l'URL de l'API
import { Departement } from '../../Models/departement';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Filiale } from '../../Models/filiale.model';


@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = `${environment.apiBaseUrl}/Departements`; // URL dynamique
  constructor(private http: HttpClient) {}
getHttpOptions() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found, request may fail');
  }
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    })
  };
}


addDepartement(departement: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, departement, this.getHttpOptions()).pipe(
    tap(response => console.log('Department added:', response)),
    catchError(this.handleError)
  );
}

// Update an existing department
updateDepartement(id: string, data: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getHttpOptions()).pipe(
    tap(response => console.log('Department updated:', response)),
    catchError(this.handleError)
  );
}
// Get all departments
getDepartements(): Observable<any> {
  return this.http.get<any>(this.apiUrl, this.getHttpOptions()).pipe(
    catchError(this.handleError)
  );
}
getToke(): string | null {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  console.log('Token récupéré :', token);
  return token;
}
// Get department by ID
getDepartementById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
    catchError(this.handleError)
  );
}





// Supprimer un département
deleteDepartement(id: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
    tap(response => console.log('Department deleted:', response)),
    catchError(this.handleError)
  );
} 
getDepartementByName(nom: string): Observable<Departement[]> {
  return this.http.get<Departement[]>(`${this.apiUrl}/search?nom=${nom}`, this.getHttpOptions()).pipe(
    catchError(this.handleError)
  );
}
  
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Erreur du serveur: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  } 
}
