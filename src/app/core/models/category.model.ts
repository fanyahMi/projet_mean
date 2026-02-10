export type CategoryType = 'product' | 'boutique';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  type: CategoryType;
  parentId?: string;
  position: number;
  isActive: boolean;
  productCount?: number;
  boutiqueCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  type: CategoryType;
  parentId?: string;
  position?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string | null;
  position?: number;
  isActive?: boolean;
}
