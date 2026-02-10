import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductService, ProductWithBoutique } from '../../../../shared/services/product.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (product(); as product) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden">
              @if (product.images?.[selectedImageIndex()]?.url) {
                <img
                  [src]="product.images[selectedImageIndex()].url"
                  [alt]="product.name"
                  class="w-full h-full object-cover"
                />
              } @else {
                <div class="w-full h-full flex items-center justify-center">
                  <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              }
            </div>

            <!-- Thumbnails -->
            @if (product.images && product.images.length > 1) {
              <div class="flex gap-3 overflow-x-auto pb-2">
                @for (image of product.images; track image.id; let i = $index) {
                  <button
                    type="button"
                    (click)="selectedImageIndex.set(i)"
                    class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
                    [class.border-brand-600]="selectedImageIndex() === i"
                    [class.border-transparent]="selectedImageIndex() !== i"
                  >
                    <img [src]="image.url" [alt]="product.name" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <a routerLink="/" class="hover:text-brand-600">Accueil</a>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <a routerLink="/products" class="hover:text-brand-600">Produits</a>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-gray-900 dark:text-white">{{ product.name }}</span>
            </nav>

            <!-- Title & Boutique -->
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ product.name }}</h1>
              <p class="text-gray-600 dark:text-gray-400">
                Par
                <a [routerLink]="['/boutiques', product.boutiqueSlug]" class="text-brand-600 dark:text-brand-400 hover:underline">
                  {{ product.boutiqueName }}
                </a>
              </p>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-brand-600 dark:text-brand-400">
                {{ product.price | number:'1.0-0' }} Ar
              </span>
              @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                <span class="text-xl text-gray-400 line-through">
                  {{ product.compareAtPrice | number:'1.0-0' }} Ar
                </span>
                <span class="px-2 py-1 text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded">
                  -{{ getDiscountPercent(product) }}%
                </span>
              }
            </div>

            <!-- Stock Status -->
            <div class="flex items-center gap-2">
              @if (product.stock > 0) {
                <span class="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  En stock ({{ product.stock }} disponibles)
                </span>
              } @else {
                <span class="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Rupture de stock
                </span>
              }
            </div>

            <!-- Description -->
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-400">{{ product.description }}</p>
            </div>

            <!-- Quantity Selector -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</label>
              <div class="flex items-center gap-4">
                <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    type="button"
                    (click)="decrementQuantity()"
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                    [disabled]="quantity() <= 1"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="px-6 py-2 text-gray-900 dark:text-white font-medium min-w-[60px] text-center">
                    {{ quantity() }}
                  </span>
                  <button
                    type="button"
                    (click)="incrementQuantity(product)"
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                    [disabled]="quantity() >= product.stock"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ product.stock }} disponible(s)
                </span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                (click)="addToCart(product)"
                [disabled]="product.stock <= 0 || isAddingToCart()"
                class="flex-1 px-8 py-4 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                @if (isAddingToCart()) {
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ajout en cours...
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Ajouter au panier
                }
              </button>

              @if (isInCart()) {
                <a
                  routerLink="/cart"
                  class="px-8 py-4 border border-brand-600 text-brand-600 dark:text-brand-400 font-medium rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir le panier ({{ cartQuantity() }})
                </a>
              }
            </div>

            <!-- Success Message -->
            @if (showAddedMessage()) {
              <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Produit ajouté au panier !</span>
              </div>
            }

            <!-- Product Details -->
            @if (product.sku || product.barcode) {
              <div class="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                @if (product.sku) {
                  <p><span class="font-medium">SKU:</span> {{ product.sku }}</p>
                }
                @if (product.barcode) {
                  <p><span class="font-medium">Code-barres:</span> {{ product.barcode }}</p>
                }
              </div>
            }

            <!-- Tags -->
            @if (product.tags?.length) {
              <div class="flex flex-wrap gap-2">
                @for (tag of product.tags; track tag) {
                  <span class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {{ tag }}
                  </span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts().length > 0) {
          <div class="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Produits similaires</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              @for (relatedProduct of relatedProducts(); track relatedProduct.id) {
                <a
                  [routerLink]="['/product', relatedProduct.boutiqueSlug, relatedProduct.slug]"
                  class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div class="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                    @if (relatedProduct.images?.[0]?.url) {
                      <img
                        [src]="relatedProduct.images[0].url"
                        [alt]="relatedProduct.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    }
                    @if (relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price) {
                      <span class="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                        -{{ getDiscountPercent(relatedProduct) }}%
                      </span>
                    }
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {{ relatedProduct.name }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ relatedProduct.boutiqueName }}</p>
                    <div class="flex items-baseline gap-2">
                      <span class="text-lg font-bold text-brand-600 dark:text-brand-400">
                        {{ relatedProduct.price | number:'1.0-0' }} Ar
                      </span>
                      @if (relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price) {
                        <span class="text-sm text-gray-400 line-through">
                          {{ relatedProduct.compareAtPrice | number:'1.0-0' }} Ar
                        </span>
                      }
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      } @else if (isLoading()) {
        <!-- Loading State -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          <div class="space-y-6">
            <div class="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="space-y-2">
              <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Product Not Found -->
        <div class="text-center py-16">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Produit introuvable</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <a
            routerLink="/products"
            class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux produits
          </a>
        </div>
      }
    </div>
  `
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();

  // State
  product = signal<ProductWithBoutique | null>(null);
  relatedProducts = signal<ProductWithBoutique[]>([]);
  isLoading = signal(true);
  quantity = signal(1);
  selectedImageIndex = signal(0);
  isAddingToCart = signal(false);
  showAddedMessage = signal(false);
  isInCart = signal(false);
  cartQuantity = signal(0);

  ngOnInit(): void {
    // Subscribe to route params to reload when navigating between products
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const boutiqueSlug = params.get('boutiqueSlug') || '';
      const productSlug = params.get('productSlug') || '';

      // Reset state
      this.isLoading.set(true);
      this.product.set(null);
      this.relatedProducts.set([]);
      this.quantity.set(1);
      this.selectedImageIndex.set(0);

      this.loadProduct(boutiqueSlug, productSlug);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(boutiqueSlug: string, productSlug: string): void {
    this.productService.getProductBySlug(boutiqueSlug, productSlug).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);

        if (product) {
          this.checkCartStatus(product.id);
          this.loadRelatedProducts(product.id);
        }
      },
      error: () => {
        this.product.set(null);
        this.isLoading.set(false);
      }
    });
  }

  private loadRelatedProducts(productId: string): void {
    this.productService.getRelatedProducts(productId, 4).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (products) => {
        this.relatedProducts.set(products);
      }
    });
  }

  private checkCartStatus(productId: string): void {
    this.isInCart.set(this.cartService.isInCart(productId));
    this.cartQuantity.set(this.cartService.getProductQuantity(productId));
  }

  getDiscountPercent(product: ProductWithBoutique): number {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }

  incrementQuantity(product: ProductWithBoutique): void {
    if (this.quantity() < product.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(product: ProductWithBoutique): void {
    this.isAddingToCart.set(true);

    this.cartService.addToCart(product, product.boutiqueName, this.quantity()).subscribe({
      next: () => {
        this.isAddingToCart.set(false);
        this.showAddedMessage.set(true);
        this.isInCart.set(true);
        this.cartQuantity.set(this.cartService.getProductQuantity(product.id));

        // Hide message after 3 seconds
        setTimeout(() => {
          this.showAddedMessage.set(false);
        }, 3000);

        // Reset quantity
        this.quantity.set(1);
      },
      error: () => {
        this.isAddingToCart.set(false);
      }
    });
  }
}
