// import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { environment } from '../../../environments/environment.development';
// import { ModeTravail, NiveauRequisType } from '../../Models/enums.model';
// import { Competence } from '../../Models/competence.model';


// interface ApiResponse<T> {
//   message: string;
//   offreEmploi?: T;
//   offresEmploi?: T[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class OffreEmploiService {
//   private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;
//   private getHeaders(): HttpHeaders {
//     const token = localStorage.getItem('TOKEN_KEY'); // Match AuthService key
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : ''
//     });
//   }

//   constructor(private http: HttpClient) {}

//   // READ: Récupérer toutes les offres
//   getAllOffres(): Observable<OffreEmploi[]> {
//     return this.http.get<ApiResponse<OffreEmploi>>(this.apiUrl, { headers: this.getHeaders() })
//       .pipe(map(response => response.offresEmploi || []));
//   }

  

//   // getOffreById(id: string): Observable<any> {
//   //   return this.http.get<any>(`${this.apiUrl}/${id}`);
//   // }

//   // READ: Recherche d'offres avec filtres
//   searchOffres(titre: string, specialite: string, typeContrat: string, statut: string, modeTravail: string): Observable<any> {
//     let params = new HttpParams();
//     if (titre) params = params.set('titre', titre);
//     if (specialite) params = params.set('specialite', specialite);
//     if (typeContrat) params = params.set('typeContrat', typeContrat.toString());
//     if (statut) params = params.set('statut', statut.toString());

//     // Convertir la valeur numérique de modeTravail en nom d'énumération
//     if (modeTravail) {
//       const modeTravailEnum = Object.keys(ModeTravail)
//         .find(key => ModeTravail[key as keyof typeof ModeTravail] === parseInt(modeTravail));
//       if (modeTravailEnum) {
//         params = params.set('modeTravail', modeTravailEnum);
//       } else {
//         console.warn(`ModeTravail ${modeTravail} non reconnu.`);
//       }
//     }

//     return this.http.get<any>(`${this.apiUrl}/search`, { params });
//   }
 
//   getOffreEmploi(id: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`);
//   }

//   createOffreEmploi(offre: OffreEmploi): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}`, offre);
//   }

//   updateOffreEmploi(id: string, offre: OffreEmploi): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/${id}`, offre);
//   }

  
//   deleteOffre(id: string): Observable<ApiResponse<null>> {
//     return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
//   }

//   getRecruteurIds(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/RecruteurIds`); // Updated endpoint
//   }

// getTypeContratLabel(value: number): string {
//   switch(value) {
//     case 1: return 'CDI';
//     case 2: return 'CDD';
//     case 3: return 'Freelance';
//     case 4: return 'Stage';
//     default: return 'Inconnu';
//   }
// }

// }
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import { environment } from '../../../environments/environment.development';
import { ModeTravail, NiveauRequisType } from '../../Models/enums.model';
import { Competence } from '../../Models/competence.model';

interface ApiResponse<T> {
  message: string;
  offreEmploi?: T;
  offresEmploi?: T[];
  success?: boolean; // Ajouté pour correspondre à la réponse JSON
  data?: any; // Ajouté pour la liste des recruteurs
}

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {
  private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('TOKEN_KEY'); // Match AuthService key
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  constructor(private http: HttpClient) {}

  // READ: Récupérer toutes les offres
  getAllOffres(): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(map(response => response.offresEmploi || []));
  }
  
  getOffreEmploi(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // CREATE: Créer une offre
  createOffreEmploi(offre: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, offre, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // UPDATE: Mettre à jour une offre
  updateOffreEmploi(id: string, offre: OffreEmploi): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, offre, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE: Supprimer une offre
  deleteOffre(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // READ: Récupérer la liste des recruteurs
  getRecruteurIds(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recruteurs`, { headers: this.getHeaders() }) // Changé en /Recruteurs
      .pipe(
        map(response => response), // Retourne la réponse complète pour vérification
        catchError(this.handleError)
      );
  }

  // Utilitaire: Obtenir le label du type de contrat
  getTypeContratLabel(value: number): string {
    switch(value) {
      case 1: return 'CDI';
      case 2: return 'CDD';
      case 3: return 'Freelance';
      case 4: return 'Stage';
      default: return 'Inconnu';
    }
  }

  // READ: Recherche d'offres avec filtres
  searchOffres(titre: string, specialite: string, typeContrat: string, statut: string, modeTravail: string): Observable<any> {
    let params = new HttpParams();
    if (titre) params = params.set('titre', titre);
    if (specialite) params = params.set('specialite', specialite);
    if (typeContrat) params = params.set('typeContrat', typeContrat.toString());
    if (statut) params = params.set('statut', statut.toString());

    if (modeTravail) {
      const modeTravailEnum = Object.keys(ModeTravail)
        .find(key => ModeTravail[key as keyof typeof ModeTravail] === parseInt(modeTravail));
      if (modeTravailEnum) {
        params = params.set('modeTravail', modeTravailEnum);
      } else {
        console.warn(`ModeTravail ${modeTravail} non reconnu.`);
      }
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params, headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.title || error.message}`;
      if (error.error?.errors) {
        errorMessage += `, Détails : ${JSON.stringify(error.error.errors)}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}