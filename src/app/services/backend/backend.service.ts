import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public getReports(body:any) {
    return this.httpClient.post('/api/reports/getReports', body);
  }

  public getReport(body:any) {
    return this.httpClient.post('/api/reports/getReport', body);
  }

  public updateReport(body:any) {
    return this.httpClient.put('/api/reports/updateReport', body);
  }

  public compareReport(body:any) {
    return this.httpClient.post('/api/reports/compareReport', body);
  }

  public generateJwt(body:any) {
    return this.httpClient.post('/api/reports/generateJwt', body);
  }

  public datasetLookup(body:any) {
    return this.httpClient.post('/api/reports/datasetLookup', body);
  }

  public createNewReport(body: any){
    return this.httpClient.post('/api/reports/createReport', body);
  }

  public cloneReport(body: any){
    return this.httpClient.post('/api/reports/cloneReport', body);
  }

  public deleteReport(body: any){
    return this.httpClient.post('/api/reports/deleteReport', body);
  }

  public addPagePlan(body: any){
    return this.httpClient.put('/api/deployment/addPagePlan', body);
  }

  public runDeployment(){
    return this.httpClient.post('/api/deployment/run', {});
  }

  public checkStatus(taskid:string){
    return this.httpClient.get('/api/deployment/progress/'+taskid);
  }

  public clearTask(){
    return this.httpClient.put('/api/deployment/clear-task',{});
  }
  
}
