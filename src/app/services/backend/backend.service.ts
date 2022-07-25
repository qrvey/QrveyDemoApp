import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public getReports(body:any) {
    return this.httpClient.post('/api/getReports', body);
  }

  public getReport(body:any) {
    return this.httpClient.post('/api/getReport', body);
  }

  public updateReport(body:any) {
    return this.httpClient.put('/api/updateReport', body);
  }

  public generateJwt(body:any) {
    return this.httpClient.post('/api/generateJwt', body);
  }

  public datasetLookup(body:any) {
    return this.httpClient.post('/api/datasetLookup', body);
  }
  
}
