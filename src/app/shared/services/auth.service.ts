import { Injectable, inject } from '@angular/core';
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
  private router = inject(Router);

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

    // TODO: Replace with actual HTTP call to backend API
    // return this.http.post<AuthResponse>('/api/auth/login', credentials)

    // Mock implementation for development
    return this.mockLogin(credentials).pipe(
      delay(800),
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

    // TODO: Replace with actual HTTP call to backend API
    // return this.http.post<AuthResponse>('/api/auth/register', data)

    // Mock implementation for development
    return this.mockRegister(data).pipe(
      delay(800),
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
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    this.tokenSubject.next(response.token);
    this.currentUserSubject.next(response.user);
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
    // TODO: Replace with actual HTTP call
    const updatedUser = { ...this.currentUser!, ...updates };
    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    return of(updatedUser);
  }

  // Mock implementations for development - Remove when connecting to real API
  private mockLogin(credentials: AuthCredentials): Observable<AuthResponse> {
    // Mock users for testing different roles
    const mockUsers: Record<string, User> = {
      'admin@mail.com': {
        id: '1',
        email: 'admin@mail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      'boutique@mail.com': {
        id: '2',
        email: 'boutique@mail.com',
        firstName: 'Boutique',
        lastName: 'Owner',
        role: 'boutique',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      'client@mail.com': {
        id: '3',
        email: 'client@mail.com',
        firstName: 'Client',
        lastName: 'User',
        role: 'acheteur',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    const user = mockUsers[credentials.email];

    if (user && credentials.password === 'password') {
      return of({
        user,
        token: 'mock-jwt-token-' + user.role,
        refreshToken: 'mock-refresh-token'
      });
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  private mockRegister(data: RegisterData): Observable<AuthResponse> {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return of({
      user: newUser,
      token: 'mock-jwt-token-' + newUser.role,
      refreshToken: 'mock-refresh-token'
    });
  }
}
