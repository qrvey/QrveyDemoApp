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
}
