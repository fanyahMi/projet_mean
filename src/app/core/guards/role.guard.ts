import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['roles'] as UserRole[];

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/signin']);
        }

        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = requiredRoles.includes(user.role);
          if (!hasRole) {
            // Redirect to user's default dashboard
            const defaultRoute = this.authService.getDefaultRouteForRole();
            return this.router.createUrlTree([defaultRoute]);
          }
        }

        return true;
      })
    );
  }
}
