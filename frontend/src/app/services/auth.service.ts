import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = '/api/auth';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.api}/login`, { email, password });
  }

  loginWithGoogle(credential: string): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.api}/google`, { credential });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isSessionExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}