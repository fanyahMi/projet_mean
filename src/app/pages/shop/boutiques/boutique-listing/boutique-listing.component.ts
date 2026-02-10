import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-boutique-listing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Toutes les boutiques</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (i of [1, 2, 3, 4, 5, 6]; track i) {
          <a
            [routerLink]="['/boutiques', 'boutique-' + i]"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"></div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Boutique {{ i }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Description de la boutique {{ i }}</p>
            <span class="text-brand-600 dark:text-brand-400 text-sm font-medium">Voir la boutique &rarr;</span>
          </a>
        }
      </div>
    </div>
  `
})
export class BoutiqueListingComponent {}
