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
}