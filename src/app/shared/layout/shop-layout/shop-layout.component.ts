import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopHeaderComponent } from './shop-header.component';
import { ShopFooterComponent } from './shop-footer.component';

@Component({
  selector: 'app-shop-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ShopHeaderComponent,
    ShopFooterComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <app-shop-header />
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-shop-footer />
    </div>
  `
})
export class ShopLayoutComponent {}
