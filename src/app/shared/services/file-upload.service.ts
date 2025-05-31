// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http';
// import { Observable, Subject } from 'rxjs';
// import { map, catchError, tap } from 'rxjs/operators';
// import { environment } from '../../../environments/environment'; // Ajustez le chemin
// import { AuthService } from './auth.service'; // Ajustez le chemin

// export interface UploadResponse {
//   fileName: string;
//   originalName: string;
//   fileSize: number;
//   fileUrl: string;
//   filePath?: string; // Optionnel
// }

// export interface MultipleUploadResponse {
//     files: UploadResponse[];
//     errors: string[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class FileUploadService {
  

//   private apiUrl = `${environment.apiBaseUrl}/FileUpload`;

//   constructor(private http: HttpClient, private authService: AuthService) {}

//   // Méthode pour obtenir les en-têtes avec le token JWT (sans Content-Type pour FormData)
//   private getAuthHeaders(): HttpHeaders {
//     const token = this.authService.getToken();
//     let headers = new HttpHeaders();
//     if (token) {
//       headers = headers.set('Authorization', `Bearer ${token}`);
//     }
//     // Ne pas définir 'Content-Type': 'multipart/form-data', Angular le fait automatiquement avec FormData
//     return headers;
//   }

//   /**
//    * Upload un seul fichier.
//    * @param file Le fichier à uploader.
//    * @param folder Le dossier de destination (optionnel, défaut 'general').
//    * @returns Observable avec la réponse de l'upload.
//    */
//   uploadFile(file: File, folder: string = 'general'): Observable<UploadResponse> {
//     const formData = new FormData();
//     formData.append('file', file, file.name);

//     return this.http.post<UploadResponse>(`${this.apiUrl}/upload?folder=${encodeURIComponent(folder)}`, formData, {
//       headers: this.getAuthHeaders(),
//       // reportProgress: true, // Décommentez pour suivre la progression (nécessite gestion dans le composant)
//       // observe: 'events' // Décommentez pour suivre la progression
//     });
//     // Si vous suivez la progression, vous devrez filtrer les événements et mapper la réponse finale.
//   }

//   /**
//    * Upload plusieurs fichiers.
//    * @param files Liste des fichiers à uploader.
//    * @param folder Le dossier de destination (optionnel, défaut 'general').
//    * @returns Observable avec la réponse de l'upload multiple.
//    */
//   uploadMultipleFiles(files: File[], folder: string = 'general'): Observable<MultipleUploadResponse> {
//     const formData = new FormData();
//     files.forEach(file => {
//         formData.append('files', file, file.name);
//     });

//     return this.http.post<MultipleUploadResponse>(`${this.apiUrl}/upload-multiple?folder=${encodeURIComponent(folder)}`, formData, {
//       headers: this.getAuthHeaders()
//     });
//   }

//   /**
//    * Supprime un fichier sur le serveur.
//    * @param fileUrl L'URL relative du fichier retournée par l'API d'upload (ex: /api/FileUpload/files/cv/xyz.pdf).
//    * @returns Observable avec la réponse de suppression.
//    */
//   deleteFile(fileUrl: string): Observable<any> {
//     // Extraire folder et fileName de l'URL
//     const urlParts = fileUrl.split('/');
//     if (urlParts.length < 6) {
//         throw new Error('URL de fichier invalide pour la suppression.');
//     }
//     const folder = urlParts[urlParts.length - 2];
//     const fileName = urlParts[urlParts.length - 1];

//     return this.http.delete(`${this.apiUrl}/files/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`, {
//         headers: this.getAuthHeaders()
//     });
//   }

//   // Note: La méthode GetFile du contrôleur est destinée à servir les fichiers directement au navigateur.
//   // Il n'est généralement pas nécessaire d'appeler cet endpoint depuis le service Angular,
//   // sauf si vous voulez télécharger le fichier via code (ce qui est moins courant).
//   // Vous utiliserez plutôt l'URL retournée (fileUrl) dans les balises <img> ou <a>.

// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development'; // Ensure this path is correct
import { AuthService } from './auth.service'; // Ensure this path is correct

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
  private apiUrl = `${environment.apiBaseUrl}/FileUpload`; // Adjust to your FileUpload controller base URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // Do NOT set 'Content-Type': 'multipart/form-data', Angular does it automatically with FormData
    return headers;
  }

  /**
   * Uploads a single file to the server.
   * @param file The File object to upload.
   * @param folder The target folder on the server (e.g., 'cvs', 'photos', 'diplomes').
   * @returns Observable with the upload response.
   */
  uploadFile(file: File, folder: string = 'general'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name); // 'file' should match your backend parameter name

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload-single?folder=${encodeURIComponent(folder)}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Uploads multiple files to the server.
   * @param files An array of File objects to upload.
   * @param folder The target folder on the server.
   * @returns Observable with the multiple upload response.
   */
  uploadMultipleFiles(files: File[], folder: string = 'general'): Observable<MultipleUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file, file.name); // 'files' should match your backend parameter name for multiple files
    });

    return this.http.post<MultipleUploadResponse>(`${this.apiUrl}/upload-multiple?folder=${encodeURIComponent(folder)}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Deletes a file on the server.
   * @param fileUrl The full URL of the file to delete (e.g., http://localhost:5000/api/FileUpload/files/cv/xyz.pdf).
   * @returns Observable with the deletion response.
   */
  deleteFile(fileUrl: string): Observable<any> {
    // This assumes your backend delete endpoint looks like:
    // DELETE /api/FileUpload/files/{folder}/{fileName}
    // You need to parse the fileUrl to extract folder and fileName.

    // Example parsing logic (adjust if your URLs are different):
    const urlParts = fileUrl.split('/');
    // Assuming URL is something like: apiBaseUrl/FileUpload/files/folderName/fileName.ext
    // So, 'folderName' is typically urlParts[urlParts.length - 2]
    // And 'fileName.ext' is urlParts[urlParts.length - 1]

    if (urlParts.length < 2) { // Basic check for sufficient parts
      console.error('Invalid fileUrl for deletion:', fileUrl);
      return throwError(() => new Error('URL de fichier invalide pour la suppression.'));
    }

    // Try to find the 'files' segment and then extract folder/filename
    const filesIndex = urlParts.indexOf('files');
    if (filesIndex > -1 && urlParts.length > filesIndex + 2) {
      const folder = urlParts[filesIndex + 1];
      const fileName = urlParts[filesIndex + 2];
      console.log(`Attempting to delete: folder=${folder}, fileName=${fileName}`);
      return this.http.delete(`${this.apiUrl}/files/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`, {
          headers: this.getAuthHeaders()
      });
    } else {
      // Fallback if URL format is not as expected, perhaps delete by full URL directly if backend supports
      console.warn('Could not parse folder and filename from URL. Attempting deletion by full URL:', fileUrl);
      // If your backend handles full URL delete, uncomment below and remove above logic
      // return this.http.delete(`${this.apiUrl}/delete-by-url?fileUrl=${encodeURIComponent(fileUrl)}`, {
      //   headers: this.getAuthHeaders()
      // });
      return throwError(() => new Error('Format d\'URL de fichier inattendu pour la suppression.'));
    }
  }
}