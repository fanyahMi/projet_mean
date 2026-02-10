import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartByBoutique } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CartSummary } from '../../../core/models/cart.model';

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

type PaymentMethod = 'cash' | 'mobile_money' | 'card';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Finaliser la commande</h1>

      @if ((cartByBoutique$ | async)?.length === 0) {
        <!-- Empty Cart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Votre panier est vide</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Ajoutez des produits avant de passer commande</p>
          <a
            routerLink="/products"
            class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            Decouvrir les produits
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Step 1: Delivery Address -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Adresse de livraison</h2>
                </div>
              </div>
              <div class="p-6">
                @if (addresses().length > 0) {
                  <div class="space-y-3">
                    @for (address of addresses(); track address.id) {
                      <label
                        class="flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors"
                        [class]="selectedAddressId() === address.id
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'"
                      >
                        <input
                          type="radio"
                          name="address"
                          [value]="address.id"
                          [checked]="selectedAddressId() === address.id"
                          (change)="selectAddress(address.id)"
                          class="mt-1"
                        />
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium text-gray-900 dark:text-white">{{ address.label }}</span>
                            @if (address.isDefault) {
                              <span class="px-2 py-0.5 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded">
                                Par defaut
                              </span>
                            }
                          </div>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ address.fullName }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ address.street }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ address.postalCode }} {{ address.city }}, {{ address.country }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">Tel: {{ address.phone }}</p>
                        </div>
                      </label>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="showNewAddressForm.set(true)"
                    class="mt-4 text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter une nouvelle adresse
                  </button>
                } @else {
                  <p class="text-gray-500 dark:text-gray-400 mb-4">Aucune adresse enregistree</p>
                }

                @if (showNewAddressForm() || addresses().length === 0) {
                  <div class="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                    <h3 class="font-medium text-gray-900 dark:text-white">Nouvelle adresse</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
                        <input
                          type="text"
                          [(ngModel)]="newAddress.fullName"
                          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telephone</label>
                        <input
                          type="tel"
                          [(ngModel)]="newAddress.phone"
                          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="+261 34 00 000 00"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                      <input
                        type="text"
                        [(ngModel)]="newAddress.street"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Rue, numero, quartier"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                        <input
                          type="text"
                          [(ngModel)]="newAddress.city"
                          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Antananarivo"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code postal</label>
                        <input
                          type="text"
                          [(ngModel)]="newAddress.postalCode"
                          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="101"
                        />
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        (click)="saveNewAddress()"
                        class="px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
                      >
                        Enregistrer
                      </button>
                      @if (addresses().length > 0) {
                        <button
                          type="button"
                          (click)="showNewAddressForm.set(false)"
                          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Step 2: Payment Method -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Mode de paiement</h2>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-3">
                  @for (method of paymentMethods; track method.id) {
                    <label
                      class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors"
                      [class]="selectedPaymentMethod() === method.id
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'"
                    >
                      <input
                        type="radio"
                        name="payment"
                        [value]="method.id"
                        [checked]="selectedPaymentMethod() === method.id"
                        (change)="selectPaymentMethod(method.id)"
                      />
                      <div class="w-10 h-10 rounded-lg flex items-center justify-center" [class]="method.bgColor">
                        <svg class="w-5 h-5" [class]="method.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="method.icon" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ method.name }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ method.description }}</p>
                      </div>
                    </label>
                  }
                </div>
              </div>
            </div>

            <!-- Step 3: Order Summary by Boutique -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Resume des articles</h2>
                </div>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (boutique of (cartByBoutique$ | async); track boutique.boutiqueId) {
                  <div class="p-6">
                    <div class="flex items-center gap-2 mb-4">
                      <div class="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                        <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span class="font-medium text-gray-900 dark:text-white">{{ boutique.boutiqueName }}</span>
                    </div>
                    <div class="space-y-3">
                      @for (item of boutique.items; track item.id) {
                        <div class="flex items-center gap-4">
                          <div class="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                            @if (item.product.images?.[0]?.url) {
                              <img [src]="item.product.images[0].url" [alt]="item.product.name" class="w-full h-full object-cover" />
                            }
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="font-medium text-gray-900 dark:text-white truncate">{{ item.product.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Qte: {{ item.quantity }} x {{ item.unitPrice | number:'1.0-0' }} Ar</p>
                          </div>
                          <p class="font-medium text-gray-900 dark:text-white">{{ item.totalPrice | number:'1.0-0' }} Ar</p>
                        </div>
                      }
                    </div>
                    <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Sous-total boutique</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ boutique.subtotal | number:'1.0-0' }} Ar</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Notes -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes pour la livraison (optionnel)</label>
              <textarea
                [(ngModel)]="orderNotes"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Instructions speciales pour la livraison..."
              ></textarea>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total de la commande</h2>

              @if (cartSummary$ | async; as summary) {
                <div class="space-y-3 mb-4">
                  <div class="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Articles ({{ summary.itemCount }})</span>
                    <span>{{ summary.subtotal | number:'1.0-0' }} Ar</span>
                  </div>
                  <div class="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Livraison</span>
                    <span class="text-green-600 dark:text-green-400">Gratuite</span>
                  </div>
                  <div class="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>TVA (20%)</span>
                    <span>{{ summary.tax | number:'1.0-0' }} Ar</span>
                  </div>
                </div>

                <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <span>Total</span>
                  <span>{{ summary.total | number:'1.0-0' }} Ar</span>
                </div>
              }

              <button
                type="button"
                (click)="placeOrder()"
                [disabled]="!canPlaceOrder() || isPlacingOrder()"
                class="w-full px-6 py-4 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                @if (isPlacingOrder()) {
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmer la commande
                }
              </button>

              @if (!canPlaceOrder()) {
                <p class="mt-3 text-sm text-center text-red-600 dark:text-red-400">
                  @if (!selectedAddressId()) {
                    Veuillez selectionner une adresse de livraison
                  } @else if (!selectedPaymentMethod()) {
                    Veuillez selectionner un mode de paiement
                  }
                </p>
              }

              <p class="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                En confirmant, vous acceptez nos
                <a href="#" class="text-brand-600 dark:text-brand-400 hover:underline">conditions generales</a>
              </p>
            </div>
          </div>
        </div>
      }

      <!-- Order Success Modal -->
      @if (showOrderSuccess()) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Commande confirmee !</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-2">Votre commande a ete passee avec succes.</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Numero de commande: <span class="font-mono font-bold">{{ orderNumber() }}</span></p>
            <div class="flex flex-col gap-3">
              <a
                routerLink="/account/orders"
                class="px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Voir mes commandes
              </a>
              <a
                routerLink="/"
                class="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Retour a l'accueil
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartByBoutique$ = this.cartService.cartByBoutique$;
  cartSummary$ = this.cartService.cartSummary$;

  addresses = signal<Address[]>([]);
  selectedAddressId = signal<string | null>(null);
  selectedPaymentMethod = signal<PaymentMethod | null>(null);
  showNewAddressForm = signal<boolean>(false);
  isPlacingOrder = signal<boolean>(false);
  showOrderSuccess = signal<boolean>(false);
  orderNumber = signal<string>('');
  orderNotes = '';

  newAddress = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Madagascar'
  };

  paymentMethods = [
    {
      id: 'cash' as PaymentMethod,
      name: 'Paiement a la livraison',
      description: 'Payez en especes lors de la reception',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'mobile_money' as PaymentMethod,
      name: 'Mobile Money',
      description: 'Orange Money, Mvola, Airtel Money',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Carte bancaire',
      description: 'Visa, Mastercard (bientot disponible)',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  ];

  ngOnInit(): void {
    this.loadAddresses();
    // Pre-fill new address with user info
    const user = this.authService.currentUser;
    if (user) {
      this.newAddress.fullName = `${user.firstName} ${user.lastName}`;
      this.newAddress.phone = user.phone || '';
    }
  }

  private loadAddresses(): void {
    // Mock addresses - Replace with actual API call
    const mockAddresses: Address[] = [
      {
        id: 'addr-1',
        label: 'Domicile',
        fullName: 'Client User',
        phone: '+261 34 00 000 00',
        street: '123 Rue Principale, Analakely',
        city: 'Antananarivo',
        postalCode: '101',
        country: 'Madagascar',
        isDefault: true
      }
    ];
    this.addresses.set(mockAddresses);

    // Auto-select default address
    const defaultAddress = mockAddresses.find(a => a.isDefault);
    if (defaultAddress) {
      this.selectedAddressId.set(defaultAddress.id);
    }
  }

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  saveNewAddress(): void {
    if (!this.newAddress.fullName || !this.newAddress.phone || !this.newAddress.street || !this.newAddress.city) {
      return;
    }

    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      label: 'Nouvelle adresse',
      fullName: this.newAddress.fullName,
      phone: this.newAddress.phone,
      street: this.newAddress.street,
      city: this.newAddress.city,
      postalCode: this.newAddress.postalCode || '',
      country: this.newAddress.country,
      isDefault: this.addresses().length === 0
    };

    this.addresses.update(addrs => [...addrs, newAddr]);
    this.selectedAddressId.set(newAddr.id);
    this.showNewAddressForm.set(false);

    // Reset form
    this.newAddress = {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'Madagascar'
    };
  }

  canPlaceOrder(): boolean {
    return !!this.selectedAddressId() && !!this.selectedPaymentMethod();
  }

  placeOrder(): void {
    if (!this.canPlaceOrder()) return;

    this.isPlacingOrder.set(true);

    // Simulate order placement
    setTimeout(() => {
      const orderNum = 'CMD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      this.orderNumber.set(orderNum);
      this.isPlacingOrder.set(false);
      this.showOrderSuccess.set(true);

      // Clear cart after successful order
      this.cartService.clearCart().subscribe();
    }, 2000);
  }
}
