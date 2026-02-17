import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  User,
  UserRole,
  AuthCredentials,
  RegisterData,
  AuthResponse
} from '../../core/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:5000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.loadStoredAuth();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get userRole(): UserRole | null {
    return this.currentUser?.role ?? null;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch {
        this.clearAuth();
      }
    }
  }

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap({
        next: (response) => {
          this.setAuth(response);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.loadingSubject.next(false);
        }
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap({
        next: (response) => {
          this.setAuth(response);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.loadingSubject.next(false);
        }
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/signin']);
  }

  private setAuth(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      this.tokenSubject.next(response.token);
    }
    if (response.user) {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const roles = Array.isArray(role) ? role : [role];
    return this.userRole ? roles.includes(this.userRole) : false;
  }

  getDefaultRouteForRole(): string {
    switch (this.userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'boutique':
        return '/boutique/dashboard';
      case 'acheteur':
        return '/';
      default:
        return '/signin';
    }
  }

  navigateToDefaultRoute(): void {
    const route = this.getDefaultRouteForRole();
    this.router.navigate([route]);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    // TODO: Implement backend endpoint for profile update
    // return this.http.put<User>(`${this.API_URL}/me`, updates).pipe(...)

    // For now, update local state only as backend endpoint might not be ready
    const updatedUser = { ...this.currentUser!, ...updates };
    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    return of(updatedUser);
  }
}
