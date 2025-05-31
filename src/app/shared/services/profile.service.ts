import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({ providedIn: 'root' })
export class ProfileService {
   private apiUrl = `${environment.apiBaseUrl}/Profile`; // URL dynamique


  constructor(private http: HttpClient) {}

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
}