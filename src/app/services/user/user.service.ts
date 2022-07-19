import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:any = localStorage.getItem('loggedUser');

  constructor(private httpClient: HttpClient) {}

  public getUser(){
    return this.user;
  }

  public removeUser(){
    this.user = null;
    localStorage.removeItem('loggedUser');
  }

  public setUser(){
    this.user = localStorage.getItem('loggedUser');
  }
}
