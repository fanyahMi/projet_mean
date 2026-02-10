import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Formulaire Categorie</h1>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
            <input type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows="3"></textarea>
          </div>
          <button type="submit" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  `
})
export class CategoryFormComponent {}
