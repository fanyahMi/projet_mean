import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DailyStat {
  date: string;
  orders: number;
  revenue: number;
  visitors: number;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
}

@Component({
  selector: 'app-boutique-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Statistiques</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Analysez les performances de votre boutique</p>
        </div>
        <div class="flex items-center gap-3">
          <select
            [(ngModel)]="selectedPeriod"
            class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
            <option value="365">Cette annee</option>
          </select>
          <button class="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter
          </button>
        </div>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +12.5%
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalRevenue | number:'1.0-0' }} Ar</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Chiffre d'affaires</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span class="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +8.3%
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalOrders }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Commandes</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +22.1%
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalVisitors | number:'1.0-0' }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Visiteurs</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              -2.4%
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ conversionRate }}%</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Taux de conversion</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Evolution des ventes</h2>
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="w-3 h-3 rounded-full bg-brand-500"></span>
                Revenus
              </span>
              <span class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                Commandes
              </span>
            </div>
          </div>

          <!-- Simple Chart Visualization -->
          <div class="h-64 flex items-end gap-2">
            @for (stat of dailyStats; track stat.date) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-full flex flex-col items-center gap-1">
                  <div
                    class="w-full bg-brand-500 rounded-t"
                    [style.height.px]="(stat.revenue / maxRevenue) * 200"
                  ></div>
                  <div
                    class="w-3/4 bg-green-500 rounded-t"
                    [style.height.px]="(stat.orders / maxOrders) * 50"
                  ></div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ stat.date }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Produits les plus vendus</h2>

          <div class="space-y-4">
            @for (product of topProducts; track product.id; let i = $index) {
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ i + 1 }}
                </span>
                <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img [src]="product.image" [alt]="product.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 dark:text-white truncate">{{ product.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.sold }} vendus</p>
                </div>
                <span class="font-medium text-gray-900 dark:text-white">{{ product.revenue | number:'1.0-0' }} Ar</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Order Status Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Repartition des commandes</h2>

          <div class="space-y-4">
            @for (status of orderStatusDistribution; track status.label) {
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ status.label }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.count }} ({{ status.percentage }}%)</span>
                </div>
                <div class="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    [class]="status.color"
                    [style.width.%]="status.percentage"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activite recente</h2>

          <div class="space-y-4">
            @for (activity of recentActivities; track activity.id) {
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                     [class]="activity.iconBg">
                  <svg class="w-4 h-4" [class]="activity.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (activity.type === 'order') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    }
                    @if (activity.type === 'product') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    }
                    @if (activity.type === 'review') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    }
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 dark:text-white">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Category Performance -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance par categorie</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Categorie</th>
                <th class="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Produits</th>
                <th class="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Ventes</th>
                <th class="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Revenus</th>
                <th class="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Croissance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @for (cat of categoryPerformance; track cat.name) {
                <tr>
                  <td class="py-4 font-medium text-gray-900 dark:text-white">{{ cat.name }}</td>
                  <td class="py-4 text-right text-gray-600 dark:text-gray-300">{{ cat.products }}</td>
                  <td class="py-4 text-right text-gray-600 dark:text-gray-300">{{ cat.sales }}</td>
                  <td class="py-4 text-right font-medium text-gray-900 dark:text-white">{{ cat.revenue | number:'1.0-0' }} Ar</td>
                  <td class="py-4 text-right">
                    <span [class]="cat.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ cat.growth >= 0 ? '+' : '' }}{{ cat.growth }}%
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BoutiqueStatisticsComponent {
  selectedPeriod = '30';

  // Summary stats
  totalRevenue = 2450000;
  totalOrders = 47;
  totalVisitors = 1823;
  conversionRate = 2.6;

  // Daily stats for chart
  dailyStats: DailyStat[] = [
    { date: 'Lun', orders: 5, revenue: 175000, visitors: 245 },
    { date: 'Mar', orders: 8, revenue: 280000, visitors: 312 },
    { date: 'Mer', orders: 6, revenue: 210000, visitors: 267 },
    { date: 'Jeu', orders: 9, revenue: 315000, visitors: 298 },
    { date: 'Ven', orders: 12, revenue: 420000, visitors: 356 },
    { date: 'Sam', orders: 15, revenue: 525000, visitors: 423 },
    { date: 'Dim', orders: 7, revenue: 245000, visitors: 189 }
  ];

  get maxRevenue(): number {
    return Math.max(...this.dailyStats.map(s => s.revenue));
  }

  get maxOrders(): number {
    return Math.max(...this.dailyStats.map(s => s.orders));
  }

  // Top products
  topProducts: TopProduct[] = [
    { id: '1', name: 'T-shirt Premium', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop', sold: 42, revenue: 1470000 },
    { id: '2', name: 'Jean Slim Fit', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop', sold: 28, revenue: 2100000 },
    { id: '3', name: 'Sneakers Urban', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', sold: 19, revenue: 2280000 },
    { id: '4', name: 'Ecouteurs Bluetooth', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', sold: 15, revenue: 2700000 },
    { id: '5', name: 'Montre Connectee', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', sold: 8, revenue: 2800000 }
  ];

  // Order status distribution
  orderStatusDistribution = [
    { label: 'Livrees', count: 32, percentage: 68, color: 'bg-green-500' },
    { label: 'En preparation', count: 8, percentage: 17, color: 'bg-blue-500' },
    { label: 'En attente', count: 5, percentage: 11, color: 'bg-yellow-500' },
    { label: 'Annulees', count: 2, percentage: 4, color: 'bg-red-500' }
  ];

  // Recent activities
  recentActivities = [
    { id: '1', type: 'order', message: 'Nouvelle commande #CMD-2024-048 de Jean R.', time: 'Il y a 15 min', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: '2', type: 'review', message: 'Nouvel avis 5 etoiles sur "T-shirt Premium"', time: 'Il y a 1h', iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400' },
    { id: '3', type: 'product', message: 'Stock faible: "Sneakers Urban" (3 restants)', time: 'Il y a 2h', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
    { id: '4', type: 'order', message: 'Commande #CMD-2024-045 livree', time: 'Il y a 3h', iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
    { id: '5', type: 'product', message: 'Nouveau produit ajoute: "Veste Cuir"', time: 'Il y a 5h', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' }
  ];

  // Category performance
  categoryPerformance = [
    { name: 'Mode', products: 15, sales: 89, revenue: 2890000, growth: 12.5 },
    { name: 'Electronique', products: 8, sales: 34, revenue: 4250000, growth: 8.3 },
    { name: 'Maison', products: 12, sales: 23, revenue: 980000, growth: -2.1 },
    { name: 'Sport', products: 6, sales: 18, revenue: 720000, growth: 15.7 },
    { name: 'Beaute', products: 10, sales: 42, revenue: 1680000, growth: 5.4 }
  ];
}
