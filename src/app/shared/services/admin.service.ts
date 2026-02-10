import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Boutique, BoutiqueStatus, BoutiqueStats } from '../../core/models/boutique.model';
import { Box, BoxStatus } from '../../core/models/box.model';
import { Category, CategoryType } from '../../core/models/category.model';

export interface DashboardStats {
  totalBoutiques: number;
  activeBoutiques: number;
  pendingBoutiques: number;
  totalBoxes: number;
  occupiedBoxes: number;
  availableBoxes: number;
  totalCategories: number;
  boutiquesChange: number;
  occupancyChange: number;
}

export interface RecentActivity {
  id: string;
  type: 'boutique_created' | 'boutique_validated' | 'box_assigned' | 'category_created' | 'boutique_updated';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}


@Injectable({ providedIn: 'root' })
export class AdminService {
  // Mock boutiques data
  private boutiquesSubject = new BehaviorSubject<Boutique[]>(this.generateMockBoutiques());
  boutiques$ = this.boutiquesSubject.asObservable();

  // Mock boxes data
  private boxesSubject = new BehaviorSubject<Box[]>(this.generateMockBoxes());
  boxes$ = this.boxesSubject.asObservable();

  // Mock categories data
  private categoriesSubject = new BehaviorSubject<Category[]>(this.generateMockCategories());
  categories$ = this.categoriesSubject.asObservable();

  // Dashboard stats
  getDashboardStats(): Observable<DashboardStats> {
    const boutiques = this.boutiquesSubject.value;
    const boxes = this.boxesSubject.value;
    const categories = this.categoriesSubject.value;

    return of({
      totalBoutiques: boutiques.length,
      activeBoutiques: boutiques.filter(b => b.status === 'active').length,
      pendingBoutiques: boutiques.filter(b => b.status === 'pending').length,
      totalBoxes: boxes.length,
      occupiedBoxes: boxes.filter(b => b.status === 'occupied').length,
      availableBoxes: boxes.filter(b => b.status === 'available').length,
      totalCategories: categories.length,
      boutiquesChange: 15.2,
      occupancyChange: 5.1
    }).pipe(delay(300));
  }

  // Recent activity
  getRecentActivity(): Observable<RecentActivity[]> {
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'boutique_created',
        title: 'Nouvelle boutique créée',
        description: 'Fashion Store a été ajouté au centre',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        icon: 'store',
        color: 'blue'
      },
      {
        id: '2',
        type: 'boutique_validated',
        title: 'Boutique validée',
        description: 'Tech Hub a été activée avec succès',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        icon: 'check-circle',
        color: 'emerald'
      },
      {
        id: '3',
        type: 'box_assigned',
        title: 'Box attribué',
        description: 'Box A-105 attribué à Mode Express',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        icon: 'map-pin',
        color: 'purple'
      },
      {
        id: '4',
        type: 'category_created',
        title: 'Nouvelle catégorie',
        description: 'La catégorie "Services" a été créée',
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        icon: 'package',
        color: 'orange'
      },
      {
        id: '5',
        type: 'boutique_updated',
        title: 'Boutique mise à jour',
        description: 'Électro Shop a mis à jour son profil',
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
        icon: 'store',
        color: 'blue'
      }
    ];
    return of(activities).pipe(delay(200));
  }

  // Boutiques
  getBoutiques(filter?: { status?: BoutiqueStatus; search?: string }): Observable<Boutique[]> {
    let boutiques = this.boutiquesSubject.value;

    if (filter?.status) {
      boutiques = boutiques.filter(b => b.status === filter.status);
    }
    if (filter?.search) {
      const search = filter.search.toLowerCase();
      boutiques = boutiques.filter(b =>
        b.name.toLowerCase().includes(search) ||
        b.contactEmail.toLowerCase().includes(search)
      );
    }

    return of(boutiques).pipe(delay(200));
  }

  getBoutiqueById(id: string): Observable<Boutique | undefined> {
    return of(this.boutiquesSubject.value.find(b => b.id === id)).pipe(delay(200));
  }

  getBoutiqueStats(id: string): Observable<BoutiqueStats> {
    return of({
      totalProducts: Math.floor(Math.random() * 100) + 20,
      totalOrders: Math.floor(Math.random() * 500) + 100,
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      pendingOrders: Math.floor(Math.random() * 20),
      averageRating: 4 + Math.random(),
      totalReviews: Math.floor(Math.random() * 200) + 50
    }).pipe(delay(200));
  }

  updateBoutiqueStatus(id: string, status: BoutiqueStatus): Observable<Boutique> {
    const boutiques = this.boutiquesSubject.value;
    const index = boutiques.findIndex(b => b.id === id);
    if (index !== -1) {
      boutiques[index] = { ...boutiques[index], status, updatedAt: new Date() };
      this.boutiquesSubject.next([...boutiques]);
    }
    return of(boutiques[index]).pipe(delay(300));
  }

  // Boxes
  getBoxes(filter?: { status?: BoxStatus; floor?: number; zone?: string }): Observable<Box[]> {
    let boxes = this.boxesSubject.value;

    if (filter?.status) {
      boxes = boxes.filter(b => b.status === filter.status);
    }
    if (filter?.floor !== undefined) {
      boxes = boxes.filter(b => b.floor === filter.floor);
    }
    if (filter?.zone) {
      boxes = boxes.filter(b => b.zone === filter.zone);
    }

    return of(boxes).pipe(delay(200));
  }

  getBoxById(id: string): Observable<Box | undefined> {
    return of(this.boxesSubject.value.find(b => b.id === id)).pipe(delay(200));
  }

  assignBox(boxId: string, boutiqueId: string, boutiqueName: string): Observable<Box> {
    const boxes = this.boxesSubject.value;
    const index = boxes.findIndex(b => b.id === boxId);
    if (index !== -1) {
      boxes[index] = {
        ...boxes[index],
        status: 'occupied',
        boutiqueId,
        boutiqueName,
        updatedAt: new Date()
      };
      this.boxesSubject.next([...boxes]);
    }
    return of(boxes[index]).pipe(delay(300));
  }

  unassignBox(boxId: string): Observable<Box> {
    const boxes = this.boxesSubject.value;
    const index = boxes.findIndex(b => b.id === boxId);
    if (index !== -1) {
      boxes[index] = {
        ...boxes[index],
        status: 'available',
        boutiqueId: undefined,
        boutiqueName: undefined,
        updatedAt: new Date()
      };
      this.boxesSubject.next([...boxes]);
    }
    return of(boxes[index]).pipe(delay(300));
  }

  // Categories
  getCategories(type?: CategoryType): Observable<Category[]> {
    let categories = this.categoriesSubject.value;
    if (type) {
      categories = categories.filter(c => c.type === type);
    }
    return of(categories).pipe(delay(200));
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return of(this.categoriesSubject.value.find(c => c.id === id)).pipe(delay(200));
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: data.name || '',
      slug: data.name?.toLowerCase().replace(/\s+/g, '-') || '',
      description: data.description,
      icon: data.icon,
      type: data.type || 'product',
      parentId: data.parentId,
      position: this.categoriesSubject.value.length,
      isActive: true,
      productCount: 0,
      boutiqueCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.categoriesSubject.next([...this.categoriesSubject.value, newCategory]);
    return of(newCategory).pipe(delay(300));
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    const categories = this.categoriesSubject.value;
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data, updatedAt: new Date() };
      this.categoriesSubject.next([...categories]);
    }
    return of(categories[index]).pipe(delay(300));
  }

  deleteCategory(id: string): Observable<boolean> {
    const categories = this.categoriesSubject.value.filter(c => c.id !== id);
    this.categoriesSubject.next(categories);
    return of(true).pipe(delay(300));
  }

  toggleCategoryStatus(id: string): Observable<Category> {
    const categories = this.categoriesSubject.value;
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        isActive: !categories[index].isActive,
        updatedAt: new Date()
      };
      this.categoriesSubject.next([...categories]);
    }
    return of(categories[index]).pipe(delay(200));
  }

  // Mock data generators
  private generateMockBoutiques(): Boutique[] {
    const statuses: BoutiqueStatus[] = ['active', 'active', 'active', 'pending', 'inactive'];
    const names = [
      'Fashion Elite', 'Tech Hub', 'Mode Express', 'Électro Shop', 'Beauté Divine',
      'Sport Zone', 'Home Déco', 'Bijoux Palace', 'Kids World', 'Gourmet Corner',
      'Urban Style', 'Digital Store', 'Nature Bio', 'Artisan Local'
    ];

    return names.map((name, i) => ({
      id: `boutique-${i + 1}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: `${name} - Votre destination shopping préférée pour des produits de qualité.`,
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
      ownerId: `owner-${i + 1}`,
      categoryId: `category-${(i % 5) + 1}`,
      boxId: statuses[i % statuses.length] === 'active' ? `box-${i + 1}` : undefined,
      status: statuses[i % statuses.length],
      openingHours: this.generateOpeningHours(),
      contactEmail: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      contactPhone: `+261 34 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 90) + 10)}`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }));
  }

  private generateOpeningHours(): any[] {
    return Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      openTime: '09:00',
      closeTime: '19:00',
      isClosed: i === 0
    }));
  }

  private generateMockBoxes(): Box[] {
    const zones = ['A', 'B', 'C'];
    const statuses: BoxStatus[] = ['occupied', 'occupied', 'available', 'reserved', 'occupied'];
    const features = ['Vitrine', 'Climatisation', 'Accès handicapé', 'Réserve'];
    const boutiques = this.boutiquesSubject?.value || [];

    return Array.from({ length: 36 }, (_, i) => {
      const zone = zones[Math.floor(i / 12)];
      const floor = Math.floor((i % 12) / 6);
      const number = (i % 6) + 1;
      const status = statuses[i % statuses.length];
      const occupiedBoutique = status === 'occupied' && boutiques[i % boutiques.length];

      return {
        id: `box-${i + 1}`,
        name: `Emplacement ${zone}${floor}${number}`,
        code: `${zone}-${floor}0${number}`,
        floor,
        zone,
        area: 20 + Math.floor(Math.random() * 80),
        monthlyRent: 500 + Math.floor(Math.random() * 1500),
        status,
        boutiqueId: occupiedBoutique ? occupiedBoutique.id : undefined,
        boutiqueName: occupiedBoutique ? occupiedBoutique.name : undefined,
        features: features.slice(0, Math.floor(Math.random() * features.length) + 1),
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
    });
  }

  private generateMockCategories(): Category[] {
    const categories = [
      { name: 'Mode & Vêtements', icon: '👕', type: 'boutique' as CategoryType },
      { name: 'Électronique', icon: '📱', type: 'boutique' as CategoryType },
      { name: 'Maison & Déco', icon: '🏠', type: 'boutique' as CategoryType },
      { name: 'Sport & Loisirs', icon: '⚽', type: 'boutique' as CategoryType },
      { name: 'Beauté & Bien-être', icon: '💄', type: 'boutique' as CategoryType },
      { name: 'Alimentation', icon: '🍕', type: 'boutique' as CategoryType },
      { name: 'Bijoux & Accessoires', icon: '💎', type: 'boutique' as CategoryType },
      { name: 'Enfants & Bébés', icon: '🧸', type: 'boutique' as CategoryType },
      { name: 'Livres & Papeterie', icon: '📚', type: 'boutique' as CategoryType },
      { name: 'Services', icon: '🛠️', type: 'boutique' as CategoryType }
    ];

    return categories.map((cat, i) => ({
      id: `category-${i + 1}`,
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'et'),
      description: `Découvrez notre sélection ${cat.name.toLowerCase()}`,
      icon: cat.icon,
      type: cat.type,
      position: i,
      isActive: true,
      productCount: Math.floor(Math.random() * 200) + 50,
      boutiqueCount: Math.floor(Math.random() * 10) + 2,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }));
  }
}
