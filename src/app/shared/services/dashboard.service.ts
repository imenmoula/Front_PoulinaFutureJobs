import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/stats`; // URL dynamique

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
