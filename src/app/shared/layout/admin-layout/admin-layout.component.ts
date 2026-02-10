import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent,
    AdminSidebarComponent,
    BackdropComponent
  ],
  template: `
    <div class="min-h-screen xl:flex">
      <div>
        <app-admin-sidebar></app-admin-sidebar>
        <app-backdrop></app-backdrop>
      </div>
      <div
        class="flex-1 transition-all duration-300 ease-in-out"
        [ngClass]="{
          'xl:ml-[290px]': (isExpanded$ | async) || (isHovered$ | async),
          'xl:ml-[90px]': !(isExpanded$ | async) && !(isHovered$ | async)
        }"
      >
        <app-header />
        <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }
}
