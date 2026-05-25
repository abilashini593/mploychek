import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getRecords(userId: string): Observable<any> {
    // Showcase async delay
    return this.http.get<any>(`${this.apiUrl}/records?userId=${userId}&delay=1500`);
  }

  getAllRecords(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/records?delay=1000`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users?delay=1000`);
  }

  updateUser(userId: string, data: any): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/users/${userId}`,
    data
  );
}
}
