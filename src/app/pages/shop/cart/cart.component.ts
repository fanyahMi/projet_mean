import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartByBoutique } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CartItem, CartSummary } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mon Panier</h1>

      @if (cartByBoutique$ | async; as boutiques) {
        @if (boutiques.length > 0) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items by Boutique -->
            <div class="lg:col-span-2 space-y-6">
              @for (boutique of boutiques; track boutique.boutiqueId) {
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <!-- Boutique Header -->
                  <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                        <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h2 class="font-semibold text-gray-900 dark:text-white">{{ boutique.boutiqueName }}</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ boutique.items.length }} article(s)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="removeBoutiqueItems(boutique.boutiqueId)"
                      class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Tout supprimer
                    </button>
                  </div>

                  <!-- Items -->
                  <div class="divide-y divide-gray-200 dark:divide-gray-700">
                    @for (item of boutique.items; track item.id) {
                      <div class="p-6 flex gap-4">
                        <!-- Product Image -->
                        <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          @if (item.product.images?.[0]?.url) {
                            <img [src]="item.product.images[0].url" [alt]="item.product.name" class="w-full h-full object-cover" />
                          } @else {
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          }
                        </div>

                        <!-- Product Info -->
                        <div class="flex-1 min-w-0">
                          <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ item.product.name }}</h3>
                          @if (item.variantName) {
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.variantName }}</p>
                          }
                          <p class="text-lg font-semibold text-brand-600 dark:text-brand-400 mt-1">
                            {{ item.unitPrice | number:'1.2-2' }} Ar
                          </p>

                          <!-- Quantity Controls -->
                          <div class="flex items-center gap-4 mt-3">
                            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                              <button
                                type="button"
                                (click)="decrementQuantity(item)"
                                class="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                                [disabled]="item.quantity <= 1"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span class="px-4 py-1.5 text-gray-900 dark:text-white font-medium min-w-[40px] text-center">
                                {{ item.quantity }}
                              </span>
                              <button
                                type="button"
                                (click)="incrementQuantity(item)"
                                class="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                                [disabled]="item.quantity >= item.product.stock"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            <button
                              type="button"
                              (click)="removeItem(item.id)"
                              class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>

                        <!-- Item Total -->
                        <div class="text-right flex-shrink-0">
                          <p class="text-lg font-bold text-gray-900 dark:text-white">
                            {{ item.totalPrice | number:'1.2-2' }} Ar
                          </p>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Boutique Subtotal -->
                  <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Sous-total boutique</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ boutique.subtotal | number:'1.2-2' }} Ar</span>
                  </div>
                </div>
              }

              <!-- Clear Cart -->
              <div class="flex justify-end">
                <button
                  type="button"
                  (click)="clearCart()"
                  class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Vider le panier
                </button>
              </div>
            </div>

            <!-- Order Summary -->
            <div>
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume de la commande</h2>

                @if (cartSummary$ | async; as summary) {
                  <div class="space-y-3 mb-4">
                    <div class="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Articles ({{ summary.itemCount }})</span>
                      <span>{{ summary.subtotal | number:'1.2-2' }} Ar</span>
                    </div>
                    <div class="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>TVA (20%)</span>
                      <span>{{ summary.tax | number:'1.2-2' }} Ar</span>
                    </div>
                    @if (summary.discount > 0) {
                      <div class="flex justify-between text-green-600 dark:text-green-400">
                        <span>Remise</span>
                        <span>-{{ summary.discount | number:'1.2-2' }} Ar</span>
                      </div>
                    }
                  </div>

                  <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                    <span>Total</span>
                    <span>{{ summary.total | number:'1.2-2' }} Ar</span>
                  </div>
                }

                <!-- Boutique Count Info -->
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Commande aupres de {{ boutiques.length }} boutique(s)</span>
                </div>

                @if (isAuthenticated$ | async) {
                  <button
                    type="button"
                    (click)="proceedToCheckout()"
                    class="w-full px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Passer la commande
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                } @else {
                  <div class="space-y-3">
                    <a
                      routerLink="/signin"
                      [queryParams]="{ redirect: '/checkout' }"
                      class="w-full px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Se connecter pour commander
                    </a>
                    <p class="text-xs text-center text-gray-500 dark:text-gray-400">
                      Vous n'avez pas de compte ?
                      <a routerLink="/signup" class="text-brand-600 dark:text-brand-400 hover:underline">Inscrivez-vous</a>
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <!-- Empty Cart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Votre panier est vide</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Decouvrez nos produits et commencez vos achats</p>
            <a
              routerLink="/products"
              class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Decouvrir les produits
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        }
      }
    </div>
  `
})
export class CartComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartByBoutique$ = this.cartService.cartByBoutique$;
  cartSummary$ = this.cartService.cartSummary$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  incrementQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      this.cartService.updateQuantity(item.id, item.quantity + 1).subscribe();
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1).subscribe();
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId).subscribe();
  }

  removeBoutiqueItems(boutiqueId: string): void {
    this.cartService.removeBoutiqueItems(boutiqueId).subscribe();
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      this.cartService.clearCart().subscribe();
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
