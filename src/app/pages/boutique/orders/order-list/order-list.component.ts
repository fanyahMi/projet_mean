import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-boutique-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Commandes</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Gerez les commandes de votre boutique</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ getStatusCount('pending') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">En attente</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ getStatusCount('processing') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">En preparation</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ getStatusCount('ready') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pret</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ getStatusCount('delivered') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Livre</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Rechercher par numero ou client..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <!-- Date Range -->
          <div class="flex items-center gap-2">
            <input
              type="date"
              [(ngModel)]="dateFrom"
              class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span class="text-gray-500">-</span>
            <input
              type="date"
              [(ngModel)]="dateTo"
              class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Status Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2">
        @for (tab of statusTabs; track tab.value) {
          <button
            (click)="statusFilter.set(tab.value)"
            [class]="statusFilter() === tab.value
              ? 'px-4 py-2 rounded-lg font-medium bg-brand-600 text-white whitespace-nowrap'
              : 'px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap'"
          >
            {{ tab.label }}
            <span class="ml-2 px-2 py-0.5 text-xs rounded-full"
                  [class]="statusFilter() === tab.value ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'">
              {{ getStatusCount(tab.value) }}
            </span>
          </button>
        }
      </div>

      <!-- Orders Table -->
      @if (filteredOrders().length > 0) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commande</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Articles</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (order of filteredOrders(); track order.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td class="px-6 py-4">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ order.orderNumber }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.paymentMethod }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ order.customerName }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.customerEmail }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <div class="flex -space-x-2">
                          @for (item of order.items.slice(0, 3); track item.id) {
                            <div class="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-800 overflow-hidden">
                              <img [src]="item.productImage" [alt]="item.productName" class="w-full h-full object-cover" />
                            </div>
                          }
                          @if (order.items.length > 3) {
                            <div class="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <span class="text-xs text-gray-600 dark:text-gray-300">+{{ order.items.length - 3 }}</span>
                            </div>
                          }
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">{{ getTotalItems(order) }} articles</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-medium text-gray-900 dark:text-white">{{ order.total | number:'1.0-0' }} Ar</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span [class]="getStatusBadgeClass(order.status)">
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div>
                        <p class="text-sm text-gray-900 dark:text-white">{{ order.createdAt | date:'dd/MM/yyyy' }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ order.createdAt | date:'HH:mm' }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-2">
                        <a [routerLink]="['/boutique/orders', order.id]"
                           class="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                           title="Voir details">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        @if (order.status === 'pending') {
                          <button
                            (click)="confirmOrder(order)"
                            class="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Confirmer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        }
                        @if (order.status !== 'delivered' && order.status !== 'cancelled') {
                          <button
                            (click)="showStatusMenu.set(showStatusMenu() === order.id ? null : order.id)"
                            class="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                            title="Changer statut">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>

                          @if (showStatusMenu() === order.id) {
                            <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                              @for (status of getNextStatuses(order.status); track status.value) {
                                <button
                                  (click)="updateStatus(order, status.value)"
                                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  {{ status.label }}
                                </button>
                              }
                              <hr class="my-1 border-gray-200 dark:border-gray-700" />
                              <button
                                (click)="updateStatus(order, 'cancelled')"
                                class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                Annuler la commande
                              </button>
                            </div>
                          }
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ filteredOrders().length }} commande(s)
            </p>
          </div>
        </div>
      } @else {
        <!-- Empty State -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          @if (searchQuery || statusFilter() !== 'all') {
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune commande trouvee</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Essayez de modifier vos criteres de recherche</p>
            <button (click)="resetFilters()" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
              Reinitialiser les filtres
            </button>
          } @else {
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune commande</h3>
            <p class="text-gray-500 dark:text-gray-400">Les nouvelles commandes apparaitront ici</p>
          }
        </div>
      }

      <!-- Success Toast -->
      @if (showToast()) {
        <div class="fixed bottom-6 right-6 px-6 py-4 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-3 z-50">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ toastMessage() }}</span>
        </div>
      }
    </div>
  `
})
export class BoutiqueOrderListComponent {
  searchQuery = '';
  dateFrom = '';
  dateTo = '';
  statusFilter = signal<OrderStatus>('all');
  showStatusMenu = signal<string | null>(null);
  showToast = signal(false);
  toastMessage = signal('');

  statusTabs: { value: OrderStatus; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmees' },
    { value: 'processing', label: 'En preparation' },
    { value: 'ready', label: 'Pret' },
    { value: 'delivered', label: 'Livrees' },
    { value: 'cancelled', label: 'Annulees' }
  ];

  orders = signal<Order[]>([
    {
      id: 'ord-1',
      orderNumber: 'CMD-2024-001',
      customerId: 'cust-1',
      customerName: 'Jean Rakoto',
      customerEmail: 'jean.rakoto@email.com',
      customerPhone: '+261 34 12 345 67',
      items: [
        { id: 'item-1', productId: 'prod-1', productName: 'T-shirt Premium', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop', quantity: 2, price: 35000 },
        { id: 'item-2', productId: 'prod-2', productName: 'Jean Slim Fit', productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop', quantity: 1, price: 75000 }
      ],
      subtotal: 145000,
      shipping: 5000,
      total: 150000,
      status: 'pending',
      paymentMethod: 'Mobile Money',
      shippingAddress: { street: '123 Rue Rainibe', city: 'Antananarivo', postalCode: '101', country: 'Madagascar' },
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'ord-2',
      orderNumber: 'CMD-2024-002',
      customerId: 'cust-2',
      customerName: 'Marie Rabe',
      customerEmail: 'marie.rabe@email.com',
      customerPhone: '+261 33 98 765 43',
      items: [
        { id: 'item-3', productId: 'prod-4', productName: 'Ecouteurs Bluetooth', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', quantity: 1, price: 180000 }
      ],
      subtotal: 180000,
      shipping: 0,
      total: 180000,
      status: 'confirmed',
      paymentMethod: 'Carte bancaire',
      shippingAddress: { street: '45 Avenue Independance', city: 'Antananarivo', postalCode: '101', country: 'Madagascar' },
      createdAt: new Date('2024-01-15T09:15:00'),
      updatedAt: new Date('2024-01-15T09:45:00')
    },
    {
      id: 'ord-3',
      orderNumber: 'CMD-2024-003',
      customerId: 'cust-3',
      customerName: 'Paul Andria',
      customerEmail: 'paul.andria@email.com',
      customerPhone: '+261 32 11 222 33',
      items: [
        { id: 'item-4', productId: 'prod-8', productName: 'Sneakers Urban', productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', quantity: 1, price: 120000 },
        { id: 'item-5', productId: 'prod-7', productName: 'Tapis de Yoga', productImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100&h=100&fit=crop', quantity: 2, price: 45000 }
      ],
      subtotal: 210000,
      shipping: 5000,
      total: 215000,
      status: 'processing',
      paymentMethod: 'Cash a la livraison',
      shippingAddress: { street: '78 Rue Rabezavana', city: 'Antsirabe', postalCode: '110', country: 'Madagascar' },
      createdAt: new Date('2024-01-14T16:20:00'),
      updatedAt: new Date('2024-01-15T08:00:00')
    },
    {
      id: 'ord-4',
      orderNumber: 'CMD-2024-004',
      customerId: 'cust-4',
      customerName: 'Sophie Aina',
      customerEmail: 'sophie.aina@email.com',
      customerPhone: '+261 34 55 666 77',
      items: [
        { id: 'item-6', productId: 'prod-6', productName: 'Coffret Soins Visage', productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop', quantity: 1, price: 95000 }
      ],
      subtotal: 95000,
      shipping: 5000,
      total: 100000,
      status: 'ready',
      paymentMethod: 'Mobile Money',
      shippingAddress: { street: '12 Boulevard Ratsimandrava', city: 'Antananarivo', postalCode: '101', country: 'Madagascar' },
      createdAt: new Date('2024-01-14T11:00:00'),
      updatedAt: new Date('2024-01-15T10:00:00')
    },
    {
      id: 'ord-5',
      orderNumber: 'CMD-2024-005',
      customerId: 'cust-5',
      customerName: 'Luc Razafy',
      customerEmail: 'luc.razafy@email.com',
      customerPhone: '+261 33 44 555 66',
      items: [
        { id: 'item-7', productId: 'prod-5', productName: 'Lampe de Bureau LED', productImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop', quantity: 1, price: 65000 },
        { id: 'item-8', productId: 'prod-1', productName: 'T-shirt Premium', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop', quantity: 3, price: 35000 }
      ],
      subtotal: 170000,
      shipping: 5000,
      total: 175000,
      status: 'delivered',
      paymentMethod: 'Carte bancaire',
      shippingAddress: { street: '56 Rue Gallieni', city: 'Toamasina', postalCode: '501', country: 'Madagascar' },
      createdAt: new Date('2024-01-13T14:30:00'),
      updatedAt: new Date('2024-01-14T16:00:00')
    },
    {
      id: 'ord-6',
      orderNumber: 'CMD-2024-006',
      customerId: 'cust-6',
      customerName: 'Nina Hery',
      customerEmail: 'nina.hery@email.com',
      customerPhone: '+261 32 77 888 99',
      items: [
        { id: 'item-9', productId: 'prod-9', productName: 'Montre Connectee', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', quantity: 1, price: 350000 }
      ],
      subtotal: 350000,
      shipping: 0,
      total: 350000,
      status: 'cancelled',
      paymentMethod: 'Mobile Money',
      shippingAddress: { street: '23 Avenue Raseta', city: 'Antananarivo', postalCode: '101', country: 'Madagascar' },
      createdAt: new Date('2024-01-12T09:00:00'),
      updatedAt: new Date('2024-01-12T15:00:00')
    },
    {
      id: 'ord-7',
      orderNumber: 'CMD-2024-007',
      customerId: 'cust-7',
      customerName: 'Feno Tiana',
      customerEmail: 'feno.tiana@email.com',
      customerPhone: '+261 34 00 111 22',
      items: [
        { id: 'item-10', productId: 'prod-2', productName: 'Jean Slim Fit', productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop', quantity: 2, price: 75000 }
      ],
      subtotal: 150000,
      shipping: 5000,
      total: 155000,
      status: 'pending',
      paymentMethod: 'Cash a la livraison',
      shippingAddress: { street: '89 Rue Rainitovo', city: 'Antananarivo', postalCode: '101', country: 'Madagascar' },
      createdAt: new Date('2024-01-15T11:45:00'),
      updatedAt: new Date('2024-01-15T11:45:00')
    }
  ]);

  filteredOrders = computed(() => {
    let result = this.orders();

    // Status filter
    if (this.statusFilter() !== 'all') {
      result = result.filter(o => o.status === this.statusFilter());
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  });

  getStatusCount(status: OrderStatus): number {
    if (status === 'all') return this.orders().length;
    return this.orders().filter(o => o.status === status).length;
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmee',
      'processing': 'En preparation',
      'ready': 'Pret',
      'delivered': 'Livree',
      'cancelled': 'Annulee'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'pending': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'confirmed': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'processing': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'ready': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'delivered': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'cancelled': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return classes[status] || '';
  }

  getNextStatuses(currentStatus: string): { value: OrderStatus; label: string }[] {
    const workflow: Record<string, { value: OrderStatus; label: string }[]> = {
      'pending': [{ value: 'confirmed', label: 'Confirmer la commande' }],
      'confirmed': [{ value: 'processing', label: 'Commencer la preparation' }],
      'processing': [{ value: 'ready', label: 'Marquer comme pret' }],
      'ready': [{ value: 'delivered', label: 'Marquer comme livre' }]
    };
    return workflow[currentStatus] || [];
  }

  confirmOrder(order: Order): void {
    this.updateStatus(order, 'confirmed');
  }

  updateStatus(order: Order, newStatus: OrderStatus): void {
    this.orders.update(orders =>
      orders.map(o => {
        if (o.id === order.id) {
          return { ...o, status: newStatus, updatedAt: new Date() };
        }
        return o;
      })
    );
    this.showStatusMenu.set(null);
    this.showNotification(`Commande ${order.orderNumber} mise a jour`);
  }

  showNotification(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.statusFilter.set('all');
  }
}
