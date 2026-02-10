import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';

@Component({
  selector: 'app-sign-up-boutique',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthPageLayoutComponent],
  template: `
    <app-auth-page-layout>
      <div class="w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Creer votre boutique</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">Rejoignez notre centre commercial</p>

        <form class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prenom</label>
              <input type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
              <input type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la boutique</label>
            <input type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
            <select class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Mode</option>
              <option>Electronique</option>
              <option>Maison</option>
              <option>Alimentation</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
            <input type="password" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <button type="submit" class="w-full px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors">
            Creer ma boutique
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Deja un compte? <a routerLink="/signin" class="text-brand-600 dark:text-brand-400 hover:underline">Connexion</a>
        </p>
      </div>
    </app-auth-page-layout>
  `
})
export class SignUpBoutiqueComponent {}
