// // import { Injectable } from '@angular/core';
// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import { Observable, throwError } from 'rxjs';
// // import { catchError, map } from 'rxjs/operators';
// // import { environment } from '../../../environments/environment.development';
// // import { User } from '../../Models/user.model';
// // import { jwtDecode } from 'jwt-decode';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class UserService {
// //   private apiUrl = `${environment.apiBaseUrl}/AppUsers`;

// //   constructor(private http: HttpClient) {}

// //   // Obtenir les en-têtes avec le token JWT
// //   private getHeaders(): HttpHeaders {
// //     const token = localStorage.getItem('token');
// //     return new HttpHeaders({
// //       'Content-Type': 'application/json',
// //       'Authorization': token ? `Bearer ${token}` : ''
// //     });
// //   }
// // private getCurrentUserId(): string | null {
// //   const token = localStorage.getItem('token');
// //   if (token) {
// //     const decoded: any = jwtDecode(token);
// //     return decoded.sub || decoded.id || null; // Ajustez selon la structure de votre token
// //   }
// //   return null;
// // }
// //   getUsers(): Observable<User[]> {
// //     return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
// //       map(response => response.data as User[]),
// //       catchError(this.handleError)
// //     );
// //   }
 
// //   searchUsers(query: string): Observable<User[]> {
// //     return this.http.get<any>(`${this.apiUrl}search?query=${encodeURIComponent(query)}`, { headers: this.getHeaders() }).pipe(
// //       map(response => response.data as User[]),
// //       catchError(this.handleError)
// //     );
// //   }
 

  
// //   // Créer un nouvel utilisateur
// //   createUser(user: any): Observable<any> {
// //     return this.http.post(`${this.apiUrl}`, user);
// //   }
  
// //    getUserById(id: string): Observable<any> {
// //     return this.http.get(`${this.apiUrl}/${id}`);
// //   }

// //   updateUser(id: string, user: any): Observable<any> {
// //     return this.http.put(`${this.apiUrl}/${id}`, user);
// //   }


 
 
// //   getUsersByRole(role: string): Observable<any> {
// //     return this.http.get<any>(`${this.apiUrl}/role/${role}`);
// //   }

 


// //   deleteUser(userId: string): Observable<any> {
// //     return this.http.delete(`${this.apiUrl}/${userId}`);
// //   }

 
// //   private handleError(error: any): Observable<never> {
// //     let errorMessage = 'Une erreur est survenue';
// //     if (error.error instanceof ErrorEvent) {
// //       errorMessage = `Erreur: ${error.error.message}`;
// //     } else {
// //       errorMessage = `Code: ${error.status}, Message: ${error.error.message || error.message}`;
// //     }
// //     return throwError(() => new Error(errorMessage));
// //   }
// // }
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { environment } from '../../../environments/environment.development';
// import { User } from '../../Models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = `${environment.apiBaseUrl}/AppUsers`;

//   constructor(private http: HttpClient) {}

//   // Obtenir les en-têtes avec le token JWT
//   private getHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : ''
//     });
//   }

//   // GET: Récupérer tous les utilisateurs
//   getUsers(): Observable<User[]> {
//     return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
//       map(response => response.data as User[]),
//       catchError(this.handleError)
//     );
//   }
//   
//   // GET: Récupérer un utilisateur par ID
//   getUserById(id: string): Observable<User> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
//       map(response => response.data as User),
//       catchError(this.handleError)
//     );
//   }

//   // POST: Créer un nouvel utilisateur
//   createUser(user: User): Observable<User> {
//     return this.http.post<User>(this.apiUrl, user, { headers: this.getHeaders() }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // PUT: Mettre à jour un utilisateur
//   updateUser(id: string, user: User): Observable<User> {
//     return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // DELETE: Supprimer un utilisateur
//   deleteUser(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // Gestion des erreurs
//   private handleError(error: any): Observable<never> {
//     let errorMessage = 'Une erreur est survenue';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Erreur: ${error.error.message}`;
//     } else {
//       errorMessage = `Code: ${error.status}, Message: ${error.error.message || error.message}`;
//     }
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserRole } from '../../Models/user-role.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiUrl = `${environment.apiBaseUrl}/AppUsers`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Vérifiez que le token est bien stocké
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/role/${role}`, { headers: this.getHeaders() });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  // updateUser(id: string, user: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, user);
  // }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email?email=${email}`);
  }
}