import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  // baseURL = 'http://localhost:5006/api';


  createUser(formData:any){
    /*formData.role="admin";
    formData.poste="rh";
    formData.filialeId="1";*/
    
    return this.http.post(environment.apiBaseUrl+'/signup',formData);
  }
  signin(formData:any){
    return this.http.post(environment.apiBaseUrl+'/signin',formData);
  }
  isloggedIn(){
    return this.getToken()!=null?true:false;
  }
saveToken(token:string){
  localStorage.setItem('TOKEN_KEY',token);
}

getToken(){
  return localStorage.getItem('TOKEN_KEY');
}
  deleteToken(){
    localStorage.removeItem('TOKEN_KEY');
  }

  getClaims(){
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]))
   }
}
