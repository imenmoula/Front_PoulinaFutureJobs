import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';



@Injectable({ providedIn: 'root' })
export class ProfileService {
   private apiUrl = `${environment.apiBaseUrl}/Profile`; // URL dynamique
  private uploadUrl = `${environment. apiBaseUrl}/fileupload/upload-profile-photo`;


  constructor(private http: HttpClient) {}
 private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }


  // Diplômes
  addDiplome(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/diplomes`, dto);
  }
  updateDiplome(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/diplomes/${id}`, dto);
  }
  deleteDiplome(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/diplomes/${id}`);
  }

  // Expériences
  addExperience(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/experiences`, dto);
  }
  updateExperience(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/experiences/${id}`, dto);
  }
  deleteExperience(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/experiences/${id}`);
  }

  // Certificats
  addCertificat(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/certificats`, dto);
  }
  updateCertificat(id: string, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/certificats/${id}`, dto);
  }
  deleteCertificat(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/certificats/${id}`);
  }

  /***************les methode on accountendpoint .net core */
 
  // profile.service.ts

// Ajouter ces méthodes à ProfileService

getAllDiplomes(): Observable<any> {
  return this.http.get(`${this.apiUrl}/diplomes`, { headers: this.getHeaders() });
}

getAllExperiences(): Observable<any> {
  return this.http.get(`${this.apiUrl}/experiences`, { headers: this.getHeaders() });
}

getAllCertificats(): Observable<any> {
  return this.http.get(`${this.apiUrl}/certificats`, { headers: this.getHeaders() });
}


}