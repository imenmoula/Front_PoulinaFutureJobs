import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development'; // Ensure this path is correct
import { AuthService } from './auth.service'; // <-- Import AuthService

export interface UploadResponse {
  fileName: string;
  originalName: string;
  fileSize: number;
  fileUrl: string;
  filePath?: string; // Optional
}

export interface MultipleUploadResponse {
    files: UploadResponse[];
    errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiBaseUrl}/FileUpload`;
  private uploadUrl = `${this.apiUrl}/upload-profile-photo`; // Specific endpoint for profile photo

  // <-- Inject AuthService
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    // <-- Use AuthService to get the token
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Do NOT set Content-Type for FormData, Angular handles it
    return headers;
  }

  // uploadFile method remains largely the same but uses the corrected getHeaders
  uploadFile(file: File, folder: string = 'general'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload-single?folder=${encodeURIComponent(folder)}`, formData, {
      headers: this.getHeaders() // Uses corrected headers
    }).pipe(catchError(this.handleError));
  }

  // uploadMultipleFiles method remains largely the same but uses the corrected getHeaders
  uploadMultipleFiles(files: File[], folder: string = 'general'): Observable<MultipleUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file, file.name);
    });
    return this.http.post<MultipleUploadResponse>(`${this.apiUrl}/upload-multiple?folder=${encodeURIComponent(folder)}`, formData, {
      headers: this.getHeaders() // Uses corrected headers
    }).pipe(catchError(this.handleError));
  }

  // deleteFile method remains largely the same but uses the corrected getHeaders
  deleteFile(fileUrl: string): Observable<any> {
    const urlParts = fileUrl.split('/');
    const filesIndex = urlParts.indexOf('files');
    if (filesIndex > -1 && urlParts.length > filesIndex + 2) {
      const folder = urlParts[filesIndex + 1];
      const fileName = urlParts[filesIndex + 2];
      return this.http.delete(`${this.apiUrl}/files/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`, {
          headers: this.getHeaders() // Uses corrected headers
      }).pipe(catchError(this.handleError));
    } else {
      console.error('Invalid fileUrl for deletion:', fileUrl);
      return throwError(() => new Error('Format d\\URL de fichier inattendu pour la suppression.'));
    }
  }

  // uploadProfilePhoto uses the specific endpoint and corrected headers
  uploadProfilePhoto(file: File): Observable<{ message: string; filePath: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file'

    return this.http.post<{ message: string; filePath: string; fileUrl: string }>(
      this.uploadUrl, // Use the specific endpoint: /api/FileUpload/upload-profile-photo
      formData,
      { headers: this.getHeaders() } // Uses corrected headers
    ).pipe(catchError(this.handleError));
  }

  // Generic error handler
  private handleError(error: any): Observable<never> {
    console.error('FileUploadService Error:', error);
    let errorMessage = 'Une erreur est survenue lors de l\\opération sur le fichier.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else if (error.status === 401) {
        errorMessage = 'Erreur d\\authentification. Veuillez vous reconnecter.';
        // Optionally trigger logout via AuthService
        // this.authService.logout();
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Erreur serveur: ${error.status}, ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

