import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';
import { Product, ProductFilter, PaginatedProducts } from '../../core/models/product.model';

export interface ProductWithBoutique extends Product {
  boutiqueName: string;
  boutiqueSlug: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/products';

  // Categories for filtering (Still hardcoded for now, or fetch from API if available)
  readonly categories = signal([
    { id: 'cat-vetements', name: 'Vêtements', slug: 'vetements' },
    { id: 'cat-electronique', name: 'Électronique', slug: 'electronique' },
    { id: 'cat-beaute', name: 'Beauté & Soins', slug: 'beaute' },
    { id: 'cat-maison', name: 'Maison & Déco', slug: 'maison' },
    { id: 'cat-sport', name: 'Sports & Loisirs', slug: 'sport' },
    { id: 'cat-accessoires', name: 'Accessoires', slug: 'accessoires' },
    { id: 'cat-livres', name: 'Livres & Culture', slug: 'livres' }
  ]);

  readonly priceRanges = [
    { label: 'Moins de 50 000 Ar', min: 0, max: 50000 },
    { label: '50 000 - 100 000 Ar', min: 50000, max: 100000 },
    { label: '100 000 - 200 000 Ar', min: 100000, max: 200000 },
    { label: '200 000 - 500 000 Ar', min: 200000, max: 500000 },
    { label: 'Plus de 500 000 Ar', min: 500000, max: Infinity }
  ];

  getAllProducts(): Observable<ProductWithBoutique[]> {
    return this.http.get<{ products: any[] }>(this.API_URL).pipe(
      map(response => response.products.map(p => this.mapBackendProduct(p)))
    );
  }

  getProducts(filter: ProductFilter = {}): Observable<PaginatedProducts & { items: ProductWithBoutique[] }> {
    // Construct query params
    let params = new HttpParams();
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());
    if (filter.search) params = params.set('keyword', filter.search);

    // Note: Other filters (category, boutique, price) are not fully implemented in backend basic controller yet.
    // They will be ignored by backend for now but URL structure is ready.
    if (filter.categoryId) params = params.set('category', filter.categoryId);
    // ... other filters

    return this.http.get<{ products: any[], page: number, pages: number, total: number }>(this.API_URL, { params }).pipe(
      map(response => ({
        items: response.products.map(p => this.mapBackendProduct(p)),
        total: response.total || response.products.length * response.pages, // Fallback if total not returned
        page: response.page,
        limit: filter.limit || 12,
        totalPages: response.pages
      }))
    );
  }

  private mapBackendProduct(p: any): ProductWithBoutique {
    return {
      id: p._id,
      boutiqueId: p.boutique?._id || p.boutique,
      categoryId: p.category?._id || p.category,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      images: p.images || [],
      status: p.status,
      isFeatured: p.isFeatured,
      tags: p.tags || [],
      sku: p.sku,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      boutiqueName: p.boutique?.name || '',
      boutiqueSlug: p.boutique?.slug || ''
    };
  }

  getProductBySlug(boutiqueSlug: string, productSlug: string): Observable<ProductWithBoutique | null> {
    // Backend basic controller only supports by ID currently. 
    // We strictly should update backend to support by Slug.
    // For now, let's try to fetch all and find (not efficient but works for "verification").
    // OR just use getProductById if the frontend logic uses IDs internally.
    // But route is usually /:boutiqueSlug/:productSlug

    // Fallback: Fetch all (or search by slug if backend supported it)
    return this.getAllProducts().pipe(
      map(products => products.find(p => p.boutiqueSlug === boutiqueSlug && p.slug === productSlug) || null)
    );
  }

  getProductById(id: string): Observable<ProductWithBoutique | null> {
    return this.http.get<ProductWithBoutique>(`${this.API_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  getFeaturedProducts(limit: number = 8): Observable<ProductWithBoutique[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.isFeatured).slice(0, limit))
    );
  }

  getProductsByBoutique(boutiqueSlug: string): Observable<ProductWithBoutique[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.boutiqueSlug === boutiqueSlug))
    );
  }

  getRelatedProducts(productId: string, limit: number = 4): Observable<ProductWithBoutique[]> {
    // Mock logic on client side for now using filtered list
    return this.getAllProducts().pipe(
      map(products => {
        const current = products.find(p => p.id === productId);
        if (!current) return [];
        return products
          .filter(p => p.id !== productId && p.categoryId === current.categoryId)
          .slice(0, limit);
      })
    );
  }

  getAllTags(): string[] {
    return ['Nouveau', 'Tendance', 'Promo', 'Bio', 'Luxe', 'Sport']; // Hardcoded or fetch unique from products
  }
}
