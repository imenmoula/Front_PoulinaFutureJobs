// import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { OffreEmploi } from '../../Models/offre-emploi.model';
// import { environment } from '../../../environments/environment.development';
// import { Competence } from '../../Models/competence.model';

// interface ApiResponse<T> {
//   message: string;
//   offreEmploi?: T;
//   offresEmploi?: T[];
//   success?: boolean; // Ajouté pour correspondre à la réponse JSON
//   data?: any; // Ajouté pour la liste des recruteurszzzzzzzzzzzzzzzz
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
  
//   getOffreEmploi(id: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // CREATE: Créer une offre
//   createOffreEmploi(offre: any): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}`, offre, { headers: this.getHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // UPDATE: Mettre à jour une offre
//   updateOffreEmploi(id: string, offre: OffreEmploi): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/${id}`, offre, { headers: this.getHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // DELETE: Supprimer une offre
//   deleteOffre(id: string): Observable<ApiResponse<null>> {
//     return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // READ: Récupérer la liste des recruteurs
//   getRecruteurIds(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/Recruteurs`, { headers: this.getHeaders() }) // Changé en /Recruteurs
//       .pipe(
//         map(response => response), // Retourne la réponse complète pour vérification
//         catchError(this.handleError)
//       );
//   }

//   // Utilitaire: Obtenir le label du type de contrat
//   getTypeContratLabel(value: number): string {
//     switch(value) {
//       case 1: return 'CDI';
//       case 2: return 'CDD';
//       case 3: return 'Freelance';
//       case 4: return 'Stage';
//       default: return 'Inconnu';
//     }
//   }

//   // READ: Recherche d'offres avec filtres
//   searchOffres(titre: string, specialite: string, typeContrat: string, statut: string, modeTravail: string): Observable<any> {
//     let params = new HttpParams();

//     if (titre) params = params.set('titre', titre);
//     if (specialite) params = params.set('specialite', specialite);
//     if (typeContrat) params = params.set('typeContrat', typeContrat);
//     if (statut) params = params.set('statut', statut);
//     if (modeTravail) params = params.set('modeTravail', modeTravail);

//     return this.http.get<any>(`${this.apiUrl}/search`, { params, headers: this.getHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

  

//   // Gestion des erreurs HTTP
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'Une erreur est survenue';
//     if (error.error instanceof ErrorEvent) {
//       // Erreur côté client
//       errorMessage = `Erreur client : ${error.error.message}`;
//     } else {
//       // Erreur côté serveur
//       errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.title || error.message}`;
//       if (error.error?.errors) {
//         errorMessage += `, Détails : ${JSON.stringify(error.error.errors)}`;
//       }
//     }
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }

//   // Dans offre-emploi.service.ts
//   getOffresByFiliale(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/offres-par-filiale`);
//   }

//   getOffreById(id: string): Observable<OffreEmploi> {
//     return this.http.get<OffreEmploi>(`${this.apiUrl}/${id}`);
//   }

//   getTypesContrat(): Observable<string[]> {
//     return this.http.get<string[]>(`${this.apiUrl}/types-contrat`);
//   }

//   getStatuts(): Observable<string[]> {
//     return this.http.get<string[]>(`${this.apiUrl}/statuts`);
//   }

//   getModesTravail(): Observable<string[]> {
//     return this.http.get<string[]>(`${this.apiUrl}/modes-travail`);
//   }

//   getNiveauxRequis(): Observable<string[]> {
//     return this.http.get<string[]>(`${this.apiUrl}/niveaux-requis`);
//   }
// }

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OffreEmploi } from '../../Models/offre-emploi.model';
import { environment } from '../../../environments/environment.development';

interface ApiResponse<T> {
  message: string;
  offreEmploi?: T;
  offresEmploi?: T[];
  success?: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {
  private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('TOKEN_KEY');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  constructor(private http: HttpClient) {}

  // Récupérer toutes les offres
  getAllOffres(): Observable<OffreEmploi[]> {
    return this.http.get<ApiResponse<OffreEmploi>>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.offresEmploi || []),
        catchError(this.handleError)
      );
  }



  // Récupérer une offre par ID
  getOffreEmploi(id: string): Observable<OffreEmploi> {
    console.log(`Fetching offre with ID: ${id}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Raw API response:', JSON.stringify(response, null, 2))),
        map(response => {
          // Extraction des données selon la structure de réponse de votre API
          if (response && response.data) {
            return response.data;
          } else if (response && response.offreEmploi) {
            return response.offreEmploi;
          } else {
            return response; // Fallback si la structure est différente
          }
        }),
        catchError(error => {
          console.error('Error in getOffreEmploi:', error);
          return throwError(() => new Error(`Erreur lors de la récupération de l'offre: ${error.message}`));
        })
      );
  }

  // Créer une offre
  createOffreEmploi(offre: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, offre, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Mettre à jour une offre
  updateOffreEmploi(id: string, offre: any): Observable<any> {
    console.log('Update Offre Payload:', JSON.stringify(offre, null, 2));
    return this.http.put<any>(`${this.apiUrl}/${id}`, offre, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Update Offre Response:', response)),
        catchError(error => {
          console.error('Update Offre Error:', error);
          return this.handleError(error);
        })
      );
  }

  // Supprimer une offre
  deleteOffre(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer la liste des recruteurs
  getRecruteurIds(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recruteurs`, { headers: this.getHeaders() })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  // Nouvelles méthodes pour récupérer les listes de valeurs possibles
 // Nouvelles méthodes pour récupérer les listes de valeurs possibles
 getTypesContrat(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/enums/typeContrat`, { headers: this.getHeaders() }).pipe(
    catchError(error => {
      console.error('Erreur lors du chargement des types de contrat', error);
      // Valeurs par défaut si l'API échoue
      return of(['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'])
    })
  );
}

  getStatuts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/enums/statut`).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des statuts', error);
        return of(['Ouverte', 'Fermee', 'EnAttente']); // Fallback
      })
    );
  }

  getModesTravail(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/enums/modeTravail`).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des modes de travail', error);
        return of(['Presentiel', 'Hybride', 'Teletravail']); // Fallback
      })
    );
  }

  getNiveauxRequis(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/enums/niveauxRequis`).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des niveaux requis', error);
        return of(['Debutant', 'Intermediaire', 'Avance', 'Expert']);
      })
    );
  }

  // Recherche d'offres avec filtres
  searchOffres(titre: string, specialite: string, typeContrat: string, statut: string, modeTravail: string, idFiliale: string): Observable<any> {
    let params = new HttpParams();
    if (titre) params = params.set('titre', titre);
    if (specialite) params = params.set('specialite', specialite);
    if (typeContrat) params = params.set('typeContrat', typeContrat);
    if (statut) params = params.set('statut', statut);
    if (modeTravail) params = params.set('modeTravail', modeTravail);
    if (idFiliale) params = params.set('idFiliale', idFiliale);

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(error => {
        console.error('Erreur lors de la recherche', error);
        throw error;
      })
    );
  }

  

  // Récupérer les offres par filiale
  getOffresByFiliale(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offres-par-filiale`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  
  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur : Code ${error.status}, Message : ${error.error?.title || error.message}`;
      if (error.error?.errors) {
        errorMessage += `, Détails : ${JSON.stringify(error.error.errors)}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}