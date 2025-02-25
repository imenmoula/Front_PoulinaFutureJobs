import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  baseURL = 'http://localhost:5006/api';

  createUser(formData:any){
    return this.http.post(this.baseURL+'/signup',formData);
  }
  signin(formData:any){
    return this.http.post(this.baseURL+'/signin',formData);
  }
  isloggedIn(){
    return localStorage.getItem('TOKEN_KEY')!=null?true:false;
  }
saveToken(token:string){
  localStorage.setItem('TOKEN_KEY',token);
}
  deleteToken(){
    localStorage.removeItem('TOKEN_KEY');
  }
}
