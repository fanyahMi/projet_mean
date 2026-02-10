import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';
import { Boutique, BoutiqueStatus } from '../../../../core/models';

@Component({
  selector: 'app-admin-boutique-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Boutiques</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Gérez toutes les boutiques du centre commercial</p>
        </div>
        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/boutiques/pending"
            class="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            En attente
            <span class="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 rounded-full text-xs">{{ pendingCount }}</span>
          </a>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              placeholder="Rechercher une boutique..."
              class="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <!-- Status Filter -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Statut:</span>
            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              @for (status of statusFilters; track status.value) {
                <button
                  (click)="filterByStatus(status.value)"
                  class="px-3 py-1.5 text-sm rounded-lg transition-all"
                  [class]="selectedStatus === status.value
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                >
                  {{ status.label }}
                </button>
              }
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              (click)="viewMode = 'table'"
              class="p-2 rounded-lg transition-all"
              [class]="viewMode === 'table' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
            <button
              (click)="viewMode = 'grid'"
              class="p-2 rounded-lg transition-all"
              [class]="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalBoutiques }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeCount }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Actives</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pendingCount }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">En attente</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ inactiveCount }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Inactives</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View -->
      @if (viewMode === 'table') {
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Boutique</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emplacement</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date création</th>
                  <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                @for (boutique of filteredBoutiques; track boutique.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-4">
                        <img [src]="boutique.logo" [alt]="boutique.name" class="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-gray-700" />
                        <div>
                          <p class="font-semibold text-gray-900 dark:text-white">{{ boutique.name }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{ boutique.slug }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-gray-900 dark:text-white">{{ boutique.contactEmail }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ boutique.contactPhone || '-' }}</p>
                    </td>
                    <td class="px-6 py-4">
                      @if (boutique.boxId) {
                        <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          </svg>
                          Box attribué
                        </span>
                      } @else {
                        <span class="text-gray-400 dark:text-gray-500 text-sm">Non attribué</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClasses(boutique.status)">
                        {{ getStatusLabel(boutique.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {{ boutique.createdAt | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          [routerLink]="['/admin/boutiques', boutique.id]"
                          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400"
                          title="Voir détails"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </a>
                        <button
                          (click)="toggleStatus(boutique)"
                          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          [class]="boutique.status === 'active' ? 'text-amber-500' : 'text-emerald-500'"
                          [title]="boutique.status === 'active' ? 'Désactiver' : 'Activer'"
                        >
                          @if (boutique.status === 'active') {
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                            </svg>
                          } @else {
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          }
                        </button>
                        <button
                          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400"
                          title="Plus d'actions"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (filteredBoutiques.length === 0) {
            <div class="p-12 text-center">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucune boutique trouvée</h3>
              <p class="text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres de recherche</p>
            </div>
          }
        </div>
      }

      <!-- Grid View -->
      @if (viewMode === 'grid') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (boutique of filteredBoutiques; track boutique.id) {
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <img [src]="boutique.logo" [alt]="boutique.name" class="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-gray-700" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ boutique.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ boutique.contactEmail }}</p>
                      </div>
                      <span [class]="getStatusClasses(boutique.status)">
                        {{ getStatusLabel(boutique.status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{{ boutique.description }}</p>

                <div class="mt-4 flex items-center gap-4 text-sm">
                  @if (boutique.boxId) {
                    <span class="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      Box attribué
                    </span>
                  }
                  <span class="text-gray-500 dark:text-gray-400">
                    Créée le {{ boutique.createdAt | date:'dd/MM/yyyy' }}
                  </span>
                </div>
              </div>

              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <a
                  [routerLink]="['/admin/boutiques', boutique.id]"
                  class="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Voir détails
                </a>
                <div class="flex items-center gap-2">
                  <button
                    (click)="toggleStatus(boutique)"
                    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    [class]="boutique.status === 'active' ? 'text-amber-500' : 'text-emerald-500'"
                  >
                    @if (boutique.status === 'active') {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                      </svg>
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        @if (filteredBoutiques.length === 0) {
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucune boutique trouvée</h3>
            <p class="text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres de recherche</p>
          </div>
        }
      }
    </div>
  `
})
export class AdminBoutiqueListComponent implements OnInit {
  private adminService = inject(AdminService);

  boutiques: Boutique[] = [];
  filteredBoutiques: Boutique[] = [];
  searchQuery = '';
  selectedStatus: BoutiqueStatus | 'all' = 'all';
  viewMode: 'table' | 'grid' = 'table';

  statusFilters = [
    { value: 'all' as const, label: 'Tous' },
    { value: 'active' as BoutiqueStatus, label: 'Actifs' },
    { value: 'pending' as BoutiqueStatus, label: 'En attente' },
    { value: 'inactive' as BoutiqueStatus, label: 'Inactifs' }
  ];

  get totalBoutiques(): number {
    return this.boutiques.length;
  }

  get activeCount(): number {
    return this.boutiques.filter(b => b.status === 'active').length;
  }

  get pendingCount(): number {
    return this.boutiques.filter(b => b.status === 'pending').length;
  }

  get inactiveCount(): number {
    return this.boutiques.filter(b => b.status === 'inactive').length;
  }

  ngOnInit(): void {
    this.loadBoutiques();
  }

  private loadBoutiques(): void {
    this.adminService.getBoutiques().subscribe(boutiques => {
      this.boutiques = boutiques;
      this.applyFilters();
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  filterByStatus(status: BoutiqueStatus | 'all'): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.boutiques];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      result = result.filter(b => b.status === this.selectedStatus);
    }

    // Filter by search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.contactEmail.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
      );
    }

    this.filteredBoutiques = result;
  }

  toggleStatus(boutique: Boutique): void {
    const newStatus: BoutiqueStatus = boutique.status === 'active' ? 'inactive' : 'active';
    this.adminService.updateBoutiqueStatus(boutique.id, newStatus).subscribe(() => {
      boutique.status = newStatus;
      this.applyFilters();
    });
  }

  getStatusClasses(status: BoutiqueStatus): string {
    const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'active':
        return `${base} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400`;
      case 'pending':
        return `${base} bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400`;
      case 'inactive':
        return `${base} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400`;
      case 'suspended':
        return `${base} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`;
      default:
        return base;
    }
  }

  getStatusLabel(status: BoutiqueStatus): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'inactive': return 'Inactif';
      case 'suspended': return 'Suspendu';
      default: return status;
    }
  }
}
