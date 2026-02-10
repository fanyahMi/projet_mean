import { Product } from './product.model';

export interface Cart {
  id: string;
  customerId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  boutiqueId: string;
  boutiqueName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: Date;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
}
