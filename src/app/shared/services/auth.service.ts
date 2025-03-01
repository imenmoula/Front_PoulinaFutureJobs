// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment.development';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   constructor(private http:HttpClient) { }
//   // baseURL = 'http://localhost:5006/api';


//   createUser(formData:any){
//     /*formData.role="admin";
//     formData.poste="rh";
//     formData.filialeId="1";*/
    
//     return this.http.post(environment.apiBaseUrl+'/signup',formData);
//   }
//   signin(formData:any){
//     return this.http.post(environment.apiBaseUrl+'/signin',formData);
//   }
//   isloggedIn(){
//     return this.getToken()!=null?true:false;
//   }
// saveToken(token:string){
//   localStorage.setItem('TOKEN_KEY',token);
// }

// getToken(){
//   return localStorage.getItem('TOKEN_KEY');
// }
//   deleteToken(){
//     localStorage.removeItem('TOKEN_KEY');
//   }

//   getClaims(){
//     return JSON.parse(window.atob(this.getToken()!.split('.')[1]))
//    }
// }
// -************************:
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // Importation nommée

interface TokenPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  role?: string | string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signup', formData);
  }

  signin(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signin', formData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string) {
    localStorage.setItem('TOKEN_KEY', token);
  }

  getToken(): string | null {
    return localStorage.getItem('TOKEN_KEY');
  }

  deleteToken() {
    localStorage.removeItem('TOKEN_KEY');
  }

  getClaims(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  getUserRoles(): string[] {
    const claims = this.getClaims();
    if (!claims) return [];
    const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || claims['role'];
    return Array.isArray(roles) ? roles : roles ? [roles] : [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }
}