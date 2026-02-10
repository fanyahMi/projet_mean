import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { Product } from '../../../../core/models/product.model';

interface BoutiqueInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  category: string;
  productCount: number;
}

@Component({
  selector: 'app-boutique-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (boutique(); as bout) {
        <!-- Boutique Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div class="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
              @if (bout.logo) {
                <img [src]="bout.logo" [alt]="bout.name" class="w-full h-full object-cover rounded-xl" />
              } @else {
                <span class="text-3xl font-bold text-white">{{ bout.name.charAt(0) }}</span>
              }
            </div>
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ bout.name }}</h1>
                <span class="px-3 py-1 text-sm font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full">
                  {{ bout.category }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ bout.description }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {{ bout.productCount }} produits
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Section -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Produits de la boutique</h2>
          <div class="flex items-center gap-2">
            <select class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option>Trier par: Popularite</option>
              <option>Prix croissant</option>
              <option>Prix decroissant</option>
              <option>Nouveautes</option>
            </select>
          </div>
        </div>

        @if (products().length > 0) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (product of products(); track product.id) {
              <a
                [routerLink]="['/product', slug, product.slug]"
                class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-600 transition-all"
              >
                <div class="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                  @if (product.images?.[0]?.url) {
                    <img [src]="product.images[0].url" [alt]="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  }
                  @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                    <span class="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">
                      -{{ getDiscountPercent(product) }}%
                    </span>
                  }
                  @if (product.stock <= 0) {
                    <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span class="px-3 py-1 bg-white text-gray-900 font-medium rounded">Rupture</span>
                    </div>
                  }
                </div>
                <div class="p-4">
                  <h3 class="font-medium text-gray-900 dark:text-white mb-1 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {{ product.name }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-brand-600 dark:text-brand-400">
                      {{ product.price | number:'1.0-0' }} Ar
                    </span>
                    @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                      <span class="text-sm text-gray-400 line-through">
                        {{ product.compareAtPrice | number:'1.0-0' }} Ar
                      </span>
                    }
                  </div>
                  @if (product.stock > 0 && product.stock <= 5) {
                    <p class="text-xs text-orange-600 dark:text-orange-400 mt-1">Plus que {{ product.stock }} en stock</p>
                  }
                </div>
              </a>
            }
          </div>
        } @else {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400">Aucun produit disponible pour le moment</p>
          </div>
        }
      } @else {
        <!-- Loading State -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div class="flex items-start gap-6">
            <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div class="flex-1 space-y-3">
              <div class="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BoutiquePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  slug = this.route.snapshot.paramMap.get('slug') || '';
  boutique = signal<BoutiqueInfo | null>(null);
  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadBoutique();
    this.loadProducts();
  }

  private loadBoutique(): void {
    // Mock boutique data - Replace with actual API call
    const mockBoutique: BoutiqueInfo = {
      id: 'bout-' + this.slug,
      name: this.formatSlugToName(this.slug),
      slug: this.slug,
      description: 'Decouvrez notre selection de produits de qualite. Nous proposons une large gamme d\'articles soigneusement selectionnes pour repondre a vos besoins.',
      category: 'Mode & Accessoires',
      productCount: 8
    };
    this.boutique.set(mockBoutique);
  }

  private loadProducts(): void {
    // Mock products data - Replace with actual API call
    const productData = [
      { name: 'T-shirt Premium', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { name: 'Jean Slim Fit', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
      { name: 'Veste en Cuir', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { name: 'Sneakers Urban', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { name: 'Sac a Main', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop' },
      { name: 'Montre Classique', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop' },
      { name: 'Lunettes de Soleil', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
      { name: 'Ceinture en Cuir', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' }
    ];

    const mockProducts: Product[] = productData.map((item, index) => ({
      id: `prod-${this.slug}-${index + 1}`,
      boutiqueId: 'bout-' + this.slug,
      categoryId: 'cat-1',
      name: item.name,
      slug: this.formatNameToSlug(item.name),
      description: 'Description du produit',
      price: 25000 + (index * 15000),
      compareAtPrice: index % 3 === 0 ? 35000 + (index * 15000) : undefined,
      stock: index === 2 ? 0 : (index % 4 === 0 ? 3 : 15),
      lowStockThreshold: 5,
      images: [
        { id: '1', url: item.image, position: 0, isPrimary: true }
      ],
      status: index === 2 ? 'out_of_stock' : 'active',
      isFeatured: index < 2,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    this.products.set(mockProducts);
  }

  private formatSlugToName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatNameToSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  getDiscountPercent(product: Product): number {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }
}
