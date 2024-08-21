// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, user);
  }

  logout(): void {
    localStorage.removeItem('Bearer');
  }

  getToken(): string | null {
    return localStorage.getItem('Bearer');
  }
}
