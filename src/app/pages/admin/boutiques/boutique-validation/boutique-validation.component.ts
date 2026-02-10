import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';
import { Boutique } from '../../../../core/models';

@Component({
  selector: 'app-boutique-validation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <a routerLink="/admin/boutiques" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </a>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Boutiques en attente</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">{{ pendingBoutiques.length }} demande(s) à traiter</p>
            </div>
          </div>
        </div>
        @if (pendingBoutiques.length > 0) {
          <button
            (click)="approveAll()"
            class="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Tout approuver
          </button>
        }
      </div>

      <!-- Empty State -->
      @if (pendingBoutiques.length === 0 && !loading) {
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <div class="w-20 h-20 mx-auto mb-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tout est à jour !</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Aucune demande de boutique en attente.</p>
          <a routerLink="/admin/boutiques" class="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
            Retour aux boutiques
          </a>
        </div>
      }

      <!-- Pending List -->
      <div class="space-y-4">
        @for (boutique of pendingBoutiques; track boutique.id) {
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-6">
              <div class="flex flex-col lg:flex-row lg:items-start gap-6">
                <div class="flex items-start gap-4 flex-1">
                  <img [src]="boutique.logo" [alt]="boutique.name" class="w-20 h-20 rounded-2xl object-cover bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ boutique.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ boutique.slug }}</p>
                      </div>
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        En attente
                      </span>
                    </div>
                    <p class="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{{ boutique.description }}</p>
                  </div>
                </div>
                <div class="lg:w-64 flex-shrink-0 space-y-3">
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="text-gray-600 dark:text-gray-300 truncate">{{ boutique.contactEmail }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="text-gray-600 dark:text-gray-300">{{ boutique.createdAt | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <a [routerLink]="['/admin/boutiques', boutique.id]" class="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
                Voir plus de détails
              </a>
              <div class="flex items-center gap-3">
                <button
                  (click)="rejectBoutique(boutique.id)"
                  class="px-4 py-2 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-medium flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Refuser
                </button>
                <button
                  (click)="approveBoutique(boutique.id)"
                  [disabled]="processingId === boutique.id"
                  class="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  @if (processingId === boutique.id) {
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  }
                  Approuver
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class BoutiqueValidationComponent implements OnInit {
  private adminService = inject(AdminService);

  pendingBoutiques: Boutique[] = [];
  loading = true;
  processingId: string | null = null;

  ngOnInit(): void {
    this.loadPendingBoutiques();
  }

  private loadPendingBoutiques(): void {
    this.loading = true;
    this.adminService.getBoutiques({ status: 'pending' }).subscribe(boutiques => {
      this.pendingBoutiques = boutiques;
      this.loading = false;
    });
  }

  approveBoutique(id: string): void {
    this.processingId = id;
    this.adminService.updateBoutiqueStatus(id, 'active').subscribe(() => {
      this.pendingBoutiques = this.pendingBoutiques.filter(b => b.id !== id);
      this.processingId = null;
    });
  }

  rejectBoutique(id: string): void {
    this.adminService.updateBoutiqueStatus(id, 'inactive').subscribe(() => {
      this.pendingBoutiques = this.pendingBoutiques.filter(b => b.id !== id);
    });
  }

  approveAll(): void {
    const ids = this.pendingBoutiques.map(b => b.id);
    ids.forEach(id => {
      this.adminService.updateBoutiqueStatus(id, 'active').subscribe();
    });
    this.pendingBoutiques = [];
  }
}
