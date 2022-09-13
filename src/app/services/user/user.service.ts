import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:any = localStorage.getItem('loggedUser') ? JSON.parse(localStorage.getItem('loggedUser') as string) : null;

  constructor(private httpClient: HttpClient) {}

  public getUser(){
    return this.user;
  }

  public removeUser(){
    this.user = null;
    localStorage.removeItem('loggedUser');
  }

  public setUser(user:any){
    this.user = user;
  }

  public authUser(body:any) {
    return this.httpClient.post('/users/auth', body);
  }

  public getUsers() {
    return this.httpClient.get('/users');
  }

  public getTenantsAndUsers() {
    return this.httpClient.get('/users/tenants-users');
  }

  public getTenant(id:string) {
    return this.httpClient.get('/users/organizations/' + id);
  }

  public getPlans() {
    return this.httpClient.get('/users/plans');
  }

  public avatarGenerator (name:string){
    return 'https://ui-avatars.com/api/?name=' + name.replace(' ', '+');
  }

  public changeUserType(id:string,type:string){
    return this.httpClient.put('/users',{id,type});
  }

  public changeTenantPlan(tenantid:string,planid:string){
    return this.httpClient.put('/users/organizations/' + tenantid + '/changeplan',{planid});
  }

}
