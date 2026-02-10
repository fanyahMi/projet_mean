export type ProductStatus = 'draft' | 'active' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: string;
  boutiqueId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  images: ProductImage[];
  status: ProductStatus;
  isFeatured: boolean;
  tags: string[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: { [key: string]: string };
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductFilter {
  categoryId?: string;
  boutiqueId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
