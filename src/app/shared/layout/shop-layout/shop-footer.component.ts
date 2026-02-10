import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="bg-gray-900 text-gray-300">
      <!-- Main Footer -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <!-- Brand & Description -->
          <div class="lg:col-span-2">
            <a routerLink="/" class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Centre Commercial</h3>
                <p class="text-sm text-gray-500">Votre marketplace local</p>
              </div>
            </a>
            <p class="text-gray-400 mb-6 leading-relaxed max-w-md">
              Votre destination shopping préférée à Madagascar. Découvrez des centaines de boutiques
              et des milliers de produits authentiques au meilleur prix.
            </p>

            <!-- Social Links -->
            <div class="flex items-center gap-4">
              <a href="#" class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-semibold mb-6">Navigation</h4>
            <ul class="space-y-4">
              <li>
                <a routerLink="/" class="text-gray-400 hover:text-brand-400 transition-colors">Accueil</a>
              </li>
              <li>
                <a routerLink="/boutiques" class="text-gray-400 hover:text-brand-400 transition-colors">Boutiques</a>
              </li>
              <li>
                <a routerLink="/products" class="text-gray-400 hover:text-brand-400 transition-colors">Produits</a>
              </li>
              <li>
                <a routerLink="/products" [queryParams]="{ promo: true }" class="text-gray-400 hover:text-brand-400 transition-colors">Promotions</a>
              </li>
              <li>
                <a routerLink="/categories" class="text-gray-400 hover:text-brand-400 transition-colors">Catégories</a>
              </li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h4 class="text-white font-semibold mb-6">Service Client</h4>
            <ul class="space-y-4">
              <li>
                <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Centre d'aide</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Suivi de commande</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Retours & Échanges</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Livraison</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-white font-semibold mb-6">Contact</h4>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-gray-400">Antananarivo, Madagascar</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-gray-400">+261 34 00 000 00</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-400">contact&#64;centrecommercial.mg</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-400">Lun - Sam: 8h - 18h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Payment Methods & Trust Badges -->
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <span class="text-sm text-gray-500">Moyens de paiement :</span>
              <div class="flex items-center gap-3">
                <!-- Visa -->
                <div class="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                  <svg class="h-4" viewBox="0 0 50 16" fill="currentColor">
                    <path d="M19.5 14.5h-3l2-12h3l-2 12zm14-12l-3 8-1-4-.5-2.5c-.3-1-1-1.5-2-1.5h-4l-.1.5c1 .3 2 .6 3 1.2l2.5 9.3h3l4.5-11h-2.4zm7 12h2.5l-2-12h-2.5c-1 0-1.5.5-1.5 1.2l-4 10.8h3l.5-1.5h3.5l.5 1.5zm-3-4l1.5-4 1 4h-2.5zm-13-8l-1.5 8-3-8h-3l2 11.5c0 .3-.2.5-.5.5-.5.1-1 .1-1.5 0l-.5 2c.5.1 1.5.1 2 .1 1.5 0 2.5-.5 3-2l4.5-10h-1.5z" class="text-gray-400"/>
                  </svg>
                </div>
                <!-- Mastercard -->
                <div class="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                  <div class="flex -space-x-2">
                    <div class="w-4 h-4 rounded-full bg-red-500"></div>
                    <div class="w-4 h-4 rounded-full bg-yellow-500"></div>
                  </div>
                </div>
                <!-- Mobile Money -->
                <div class="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <!-- Cash -->
                <div class="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2 text-gray-400">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="text-sm">Paiement sécurisé</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span class="text-sm">Livraison rapide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-500">
              &copy; {{ currentYear }} Centre Commercial. Tous droits réservés.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-6">
              <a href="#" class="text-sm text-gray-500 hover:text-brand-400 transition-colors">Conditions générales</a>
              <a href="#" class="text-sm text-gray-500 hover:text-brand-400 transition-colors">Politique de confidentialité</a>
              <a href="#" class="text-sm text-gray-500 hover:text-brand-400 transition-colors">Cookies</a>
              <a href="#" class="text-sm text-gray-500 hover:text-brand-400 transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class ShopFooterComponent {
  currentYear = new Date().getFullYear();
}
