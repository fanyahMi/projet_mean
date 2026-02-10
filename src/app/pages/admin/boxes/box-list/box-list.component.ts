import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';
import { Box, BoxStatus } from '../../../../core/models';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Emplacements</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Vue d'ensemble de tous les boxes du centre commercial</p>
        </div>
        <a routerLink="/admin/boxes/assignment" class="px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Attribution
        </a>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ boxes.length }}</p>
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
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ occupiedCount }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Occupés</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ availableCount }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Disponibles</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ occupancyRate }}%</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Occupation</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Zone:</span>
            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              @for (zone of zones; track zone) {
                <button (click)="selectedZone = zone" class="px-3 py-1.5 text-sm rounded-lg transition-all" [class]="selectedZone === zone ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'">
                  {{ zone === 'all' ? 'Tous' : 'Zone ' + zone }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Floor Map -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Plan des emplacements</h2>
          <div class="flex items-center gap-4 text-sm">
            <span class="flex items-center gap-2"><span class="w-4 h-4 rounded bg-emerald-500"></span> Occupé</span>
            <span class="flex items-center gap-2"><span class="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600"></span> Disponible</span>
            <span class="flex items-center gap-2"><span class="w-4 h-4 rounded bg-amber-500"></span> Réservé</span>
          </div>
        </div>

        @for (zone of ['A', 'B', 'C']; track zone) {
          @if (selectedZone === 'all' || selectedZone === zone) {
            <div class="mb-8 last:mb-0">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Zone {{ zone }}</h3>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                @for (box of getBoxesByZone(zone); track box.id) {
                  <button (click)="selectedBox = box" class="relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all hover:scale-105 hover:shadow-lg p-2 border-2" [ngClass]="getBoxClasses(box)">
                    <span class="font-bold">{{ box.code }}</span>
                    <span class="text-xs opacity-75 mt-1">{{ box.area }}m²</span>
                  </button>
                }
              </div>
            </div>
          }
        }
      </div>

      <!-- Selected Box Modal -->
      @if (selectedBox) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" (click)="selectedBox = null">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center border-2" [ngClass]="getBoxClasses(selectedBox)">
                  <span class="font-bold text-lg">{{ selectedBox.code }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedBox.name }}</h3>
                  <span [class]="getStatusBadge(selectedBox.status)">{{ getStatusLabel(selectedBox.status) }}</span>
                </div>
              </div>
              <button (click)="selectedBox = null" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-500 dark:text-gray-400">Zone / Étage</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedBox.zone }} / {{ selectedBox.floor === 0 ? 'RDC' : selectedBox.floor }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-500 dark:text-gray-400">Surface</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedBox.area }} m²</span>
              </div>
              @if (selectedBox.boutiqueName) {
                <div class="flex justify-between py-2">
                  <span class="text-gray-500 dark:text-gray-400">Boutique</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBox.boutiqueName }}</span>
                </div>
              }
            </div>
            <button (click)="selectedBox = null" class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
              Fermer
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class BoxListComponent implements OnInit {
  private adminService = inject(AdminService);

  boxes: Box[] = [];
  selectedZone = 'all';
  selectedBox: Box | null = null;
  zones = ['all', 'A', 'B', 'C'];

  get occupiedCount(): number { return this.boxes.filter(b => b.status === 'occupied').length; }
  get availableCount(): number { return this.boxes.filter(b => b.status === 'available').length; }
  get occupancyRate(): number { return this.boxes.length > 0 ? Math.round((this.occupiedCount / this.boxes.length) * 100) : 0; }

  ngOnInit(): void {
    this.adminService.getBoxes().subscribe(boxes => this.boxes = boxes);
  }

  getBoxesByZone(zone: string): Box[] {
    return this.boxes.filter(b => b.zone === zone);
  }

  getBoxClasses(box: Box): Record<string, boolean> {
    return {
      'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300': box.status === 'occupied',
      'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300': box.status === 'available',
      'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300': box.status === 'reserved',
      'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300': box.status === 'maintenance'
    };
  }

  getStatusBadge(status: BoxStatus): string {
    const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'occupied': return `${base} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400`;
      case 'available': return `${base} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400`;
      case 'reserved': return `${base} bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400`;
      default: return base;
    }
  }

  getStatusLabel(status: BoxStatus): string {
    const labels: Record<BoxStatus, string> = { occupied: 'Occupé', available: 'Disponible', reserved: 'Réservé', maintenance: 'Maintenance' };
    return labels[status] || status;
  }
}
