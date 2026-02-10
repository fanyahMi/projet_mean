import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';
import { Category } from '../../../../core/models';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Catégories</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Organisez les catégories de boutiques</p>
        </div>
        <button (click)="showAddModal = true" class="px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle catégorie
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ categories.length }}</p>
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
            <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalBoutiques }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Boutiques</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (category of categories; track category.id; let i = $index) {
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white" [class]="getCategoryColor(i)">
                    {{ category.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.slug }}</p>
                  </div>
                </div>
                <button (click)="toggleCategoryStatus(category)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" [class]="category.isActive ? 'text-emerald-500' : 'text-gray-400'">
                  @if (category.isActive) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                  }
                </button>
              </div>
              @if (category.description) {
                <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{{ category.description }}</p>
              }
              <div class="mt-4 flex items-center gap-4 text-sm">
                <span class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                  </svg>
                  {{ category.boutiqueCount || 0 }} boutiques
                </span>
              </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span [class]="category.isActive ? 'text-emerald-600 dark:text-emerald-400 text-sm font-medium' : 'text-gray-400 text-sm'">
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </span>
              <div class="flex items-center gap-2">
                <button (click)="editCategory(category)" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button (click)="deleteCategory(category)" class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Add/Edit Modal -->
      @if (showAddModal) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" (click)="closeModal()">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                <input type="text" [(ngModel)]="formData.name" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" placeholder="Nom de la catégorie" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea [(ngModel)]="formData.description" rows="3" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Description..."></textarea>
              </div>
            </div>
            <div class="flex items-center gap-3 mt-6">
              <button (click)="closeModal()" class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                Annuler
              </button>
              <button (click)="saveCategory()" class="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium">
                {{ editingCategory ? 'Enregistrer' : 'Créer' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminCategoryListComponent implements OnInit {
  private adminService = inject(AdminService);

  categories: Category[] = [];
  showAddModal = false;
  editingCategory: Category | null = null;
  formData = { name: '', description: '' };

  private colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-rose-500 to-rose-600',
    'bg-gradient-to-br from-teal-500 to-teal-600'
  ];

  get activeCount(): number { return this.categories.filter(c => c.isActive).length; }
  get totalBoutiques(): number { return this.categories.reduce((sum, c) => sum + (c.boutiqueCount || 0), 0); }

  getCategoryColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  ngOnInit(): void {
    this.adminService.getCategories().subscribe(cats => this.categories = cats);
  }

  toggleCategoryStatus(category: Category): void {
    this.adminService.toggleCategoryStatus(category.id).subscribe(updated => {
      const index = this.categories.findIndex(c => c.id === category.id);
      if (index !== -1) this.categories[index] = updated;
    });
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.formData = { name: category.name, description: category.description || '' };
    this.showAddModal = true;
  }

  deleteCategory(category: Category): void {
    if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
      this.adminService.deleteCategory(category.id).subscribe(() => {
        this.categories = this.categories.filter(c => c.id !== category.id);
      });
    }
  }

  saveCategory(): void {
    if (this.editingCategory) {
      this.adminService.updateCategory(this.editingCategory.id, this.formData).subscribe(updated => {
        const index = this.categories.findIndex(c => c.id === this.editingCategory!.id);
        if (index !== -1) this.categories[index] = updated;
        this.closeModal();
      });
    } else {
      this.adminService.createCategory({ ...this.formData, type: 'boutique' }).subscribe(newCat => {
        this.categories.push(newCat);
        this.closeModal();
      });
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingCategory = null;
    this.formData = { name: '', description: '' };
  }
}
