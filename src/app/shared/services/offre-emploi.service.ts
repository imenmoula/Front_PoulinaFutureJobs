import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
}

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {
  private apiUrl = `${environment.apiBaseUrl}/OffreEmplois`;
  private competenceUrl = `${environment.apiBaseUrl}/Competences`;
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

  // READ: Récupérer une offre par ID
  // getOffreById(id: string): Observable<OffreEmploi> {
  //   return this.http.get<ApiResponse<OffreEmploi>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  //     .pipe(map(response => response.offreEmploi as OffreEmploi));
  // }

  getOffreById(id: string): Observable<OffreEmploi> {
    return this.http
      .get<{ message: string; offreEmploi: OffreEmploi }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.offreEmploi),
        catchError(error => {
          console.error('Erreur lors de la récupération de l\'offre:', error);
          return throwError(() => new Error('Erreur lors de la récupération des détails de l\'offre'));
        })
      );
  }

  // READ: Recherche d'offres avec filtres
  searchOffres(titre: string, specialite: string, typeContrat: string, statut: string, modeTravail: string): Observable<any> {
    let params = new HttpParams();
    if (titre) params = params.set('titre', titre);
    if (specialite) params = params.set('specialite', specialite);
    if (typeContrat) params = params.set('typeContrat', typeContrat.toString());
    if (statut) params = params.set('statut', statut.toString());

    // Convertir la valeur numérique de modeTravail en nom d'énumération
    if (modeTravail) {
      const modeTravailEnum = Object.keys(ModeTravail)
        .find(key => ModeTravail[key as keyof typeof ModeTravail] === parseInt(modeTravail));
      if (modeTravailEnum) {
        params = params.set('modeTravail', modeTravailEnum);
      } else {
        console.warn(`ModeTravail ${modeTravail} non reconnu.`);
      }
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }
  // searchOffres(titre?: string, specialite?: string, typeContrat?: string, statut?: string): Observable<any> {
  //   let params = new HttpParams();
  //   if (titre) params = params.set('titre', titre);
  //   if (specialite) params = params.set('specialite', specialite);
  //   if (typeContrat) params = params.set('typeContrat', typeContrat);
  //   if (statut) params = params.set('statut', statut);
  //   if (ModeTravail) {
  //     const modeTravailEnum: string | undefined = Object.keys(ModeTravail)
  //       .find(key => key === specialite);
  //     if (modeTravailEnum) {
  //       params = params.set('modeTravail', modeTravailEnum);
  //     } else {
  //       console.warn(`ModeTravail ${ModeTravail} non reconnu.`);
  //     }
  //   }
  //   return this.http.get<any>(`${this.apiUrl}/search`, { headers: this.getHeaders(), params });
  // }
  getCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.competenceUrl);
  }
  createOffre(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateOffre(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

//   // Construct the payload to be sent to the backend
//   const payload = {
//     ...offre,
//     datePublication: new Date().toISOString(), // Automatically set the publication date
//     offreCompetences: offre.offreCompetences.map(oc => ({
//       idCompetence: oc.idCompetence || null, // If the competence already has an ID, use it
//       niveauRequis: oc.niveauRequis, // Competency level
//       competence: oc.idCompetence ? null : { // If no competence ID, create a new competence
//         nom: oc.competence?.nom,
//         description: oc.competence?.description,
//         hardSkills: oc.competence?.hardSkills,
//         softSkills: oc.competence?.softSkills
//       }
//     }))
//   };

//   // Make the HTTP POST request to create the job offer
//   return this.http.post(this.apiUrl, payload, { headers: this.getHeaders() });
// }

  // UPDATE: Mettre à jour une offre existante
  // updateOffre(id: string, offre: OffreEmploi): Observable<ApiResponse<OffreEmploi>> {
  //   return this.http.put<ApiResponse<OffreEmploi>>(`${this.apiUrl}/${id}`, offre, { headers: this.getHeaders() });
  // }

  // In OffreEmploiService

// updateOffre(id: string, offre: OffreEmploi): Observable<any> {
//   // Construct the payload to be sent to the backend
//   const payload = {
//     ...offre,
//     offreCompetences: offre.offreCompetences.map(oc => ({
//       idOffreEmploi: id, // Include the job offer ID for the competence association
//       idCompetence: oc.idCompetence, // Competence ID (can be null for new ones)
//       niveauRequis: oc.niveauRequis, // Competency level
//       competence: oc.idCompetence ? null : oc.competence // Include competence details only if ID is null
//     }))
//   };

//   // Make the HTTP PUT request to update the job offer
//   return this.http.put(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() });
// }


  // DELETE: Supprimer une offre
  deleteOffre(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

getTypeContratLabel(value: number): string {
  switch(value) {
    case 1: return 'CDI';
    case 2: return 'CDD';
    case 3: return 'Freelance';
    case 4: return 'Stage';
    default: return 'Inconnu';
  }
}

}
