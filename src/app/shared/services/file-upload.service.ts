import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // Ajustez le chemin
import { AuthService } from './auth.service'; // Ajustez le chemin

export interface UploadResponse {
  fileName: string;
  originalName: string;
  fileSize: number;
  fileUrl: string;
  filePath?: string; // Optionnel
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

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Méthode pour obtenir les en-têtes avec le token JWT (sans Content-Type pour FormData)
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Ne pas définir 'Content-Type': 'multipart/form-data', Angular le fait automatiquement avec FormData
    return headers;
  }

  /**
   * Upload un seul fichier.
   * @param file Le fichier à uploader.
   * @param folder Le dossier de destination (optionnel, défaut 'general').
   * @returns Observable avec la réponse de l'upload.
   */
  uploadFile(file: File, folder: string = 'general'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload?folder=${encodeURIComponent(folder)}`, formData, {
      headers: this.getAuthHeaders(),
      // reportProgress: true, // Décommentez pour suivre la progression (nécessite gestion dans le composant)
      // observe: 'events' // Décommentez pour suivre la progression
    });
    // Si vous suivez la progression, vous devrez filtrer les événements et mapper la réponse finale.
  }

  /**
   * Upload plusieurs fichiers.
   * @param files Liste des fichiers à uploader.
   * @param folder Le dossier de destination (optionnel, défaut 'general').
   * @returns Observable avec la réponse de l'upload multiple.
   */
  uploadMultipleFiles(files: File[], folder: string = 'general'): Observable<MultipleUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file, file.name);
    });

    return this.http.post<MultipleUploadResponse>(`${this.apiUrl}/upload-multiple?folder=${encodeURIComponent(folder)}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Supprime un fichier sur le serveur.
   * @param fileUrl L'URL relative du fichier retournée par l'API d'upload (ex: /api/FileUpload/files/cv/xyz.pdf).
   * @returns Observable avec la réponse de suppression.
   */
  deleteFile(fileUrl: string): Observable<any> {
    // Extraire folder et fileName de l'URL
    const urlParts = fileUrl.split('/');
    if (urlParts.length < 6) {
        throw new Error('URL de fichier invalide pour la suppression.');
    }
    const folder = urlParts[urlParts.length - 2];
    const fileName = urlParts[urlParts.length - 1];

    return this.http.delete(`${this.apiUrl}/files/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`, {
        headers: this.getAuthHeaders()
    });
  }

  // Note: La méthode GetFile du contrôleur est destinée à servir les fichiers directement au navigateur.
  // Il n'est généralement pas nécessaire d'appeler cet endpoint depuis le service Angular,
  // sauf si vous voulez télécharger le fichier via code (ce qui est moins courant).
  // Vous utiliserez plutôt l'URL retournée (fileUrl) dans les balises <img> ou <a>.

}

