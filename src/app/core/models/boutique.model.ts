export type BoutiqueStatus = 'pending' | 'active' | 'inactive' | 'suspended';

export interface Boutique {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  ownerId: string;
  categoryId: string;
  boxId?: string;
  status: BoutiqueStatus;
  openingHours: OpeningHours[];
  contactEmail: string;
  contactPhone?: string;
  socialLinks?: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpeningHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string;  // "09:00"
  closeTime: string; // "18:00"
  isClosed: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface BoutiqueStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageRating: number;
  totalReviews: number;
}

export interface BoutiqueFilter {
  categoryId?: string;
  status?: BoutiqueStatus;
  search?: string;
  page?: number;
  limit?: number;
}
