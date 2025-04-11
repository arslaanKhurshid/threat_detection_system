import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Use Docker service name "backend" instead of localhost
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getThreats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/threats`);
  }

  addThreat(threat: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/threats`, threat);
  }

  getRules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rules`);
  }

  addRule(rule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rules`, rule);
  }

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alerts`);
  }
}