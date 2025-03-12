import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import de l'URL de l'API
import { Departement } from '../../Models/departement';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = `${environment.apiBaseUrl}/Departements`; // URL dynamique

  constructor(private http: HttpClient) {}

 // 🔹 Récupérer tous les départements
 getDepartements(): Observable<Departement[]> {
  return this.http.get<Departement[]>(this.apiUrl);
}

// 🔹 Récupérer un département par ID
// getDepartementById(id: string): Observable<Departement> {
//   return this.http.get<{ message: string; data: Departement }>(`${this.apiUrl}/${id}`)
//     .pipe(
//       tap(response => console.log("Réponse reçue dans le service :", response)), // Ajout du log
//       map(response => response.data) // Extraction du `data`
//     );
// }
getDepartementById(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}



// 🔹 Ajouter un département (POST)
addDepartement(departement: any): Observable<any> {
  return this.http.post(`${this.apiUrl}`, departement);
}

// 🔹 Modifier un département (PUT)
updateDepartement(id: string, departement: Departement): Observable<Departement> {
  return this.http.put<Departement>(`${this.apiUrl}/${id}`, departement);
}

// 🔹 Supprimer un département (DELETE)
deleteDepartement(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
  getDepartementByName(nom: string): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}/search?nom=${nom}`);
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
