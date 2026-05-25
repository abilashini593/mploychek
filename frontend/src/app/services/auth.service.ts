import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(userId: string, password: string, role: string): Observable<any> {
    // Add delay parameter for showcasing async process
    return this.http.post<any>(`${this.apiUrl}/login?delay=1000`, { userId, password, role })
      .pipe(tap(res => {
        if (res && res.success) {
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
