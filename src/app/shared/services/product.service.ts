import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductFilter, PaginatedProducts } from '../../core/models/product.model';

export interface ProductWithBoutique extends Product {
  boutiqueName: string;
  boutiqueSlug: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  // Mock product data with Unsplash images
  private readonly mockProducts: ProductWithBoutique[] = [
    {
      id: 'prod-001',
      boutiqueId: 'bout-001',
      boutiqueName: 'Mode Élégance',
      boutiqueSlug: 'mode-elegance',
      categoryId: 'cat-vetements',
      name: 'Chemise Lin Premium',
      slug: 'chemise-lin-premium',
      description: 'Chemise en lin de haute qualité, parfaite pour les journées chaudes. Coupe moderne et confortable. Tissu respirant et naturel, idéal pour un look élégant et décontracté.',
      shortDescription: 'Chemise en lin de haute qualité',
      price: 85000,
      compareAtPrice: 120000,
      stock: 25,
      lowStockThreshold: 5,
      images: [
        { id: 'img-001-1', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-001-2', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=600&fit=crop', position: 1, isPrimary: false },
        { id: 'img-001-3', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop', position: 2, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Nouveau', 'Lin', 'Été'],
      sku: 'CHM-LIN-001',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-20')
    },
    {
      id: 'prod-002',
      boutiqueId: 'bout-001',
      boutiqueName: 'Mode Élégance',
      boutiqueSlug: 'mode-elegance',
      categoryId: 'cat-vetements',
      name: 'Robe Soirée Noire',
      slug: 'robe-soiree-noire',
      description: 'Magnifique robe de soirée noire, coupe élégante et sophistiquée. Parfaite pour vos événements spéciaux. Tissu satiné qui épouse parfaitement les formes.',
      shortDescription: 'Robe de soirée élégante',
      price: 195000,
      compareAtPrice: 250000,
      stock: 12,
      lowStockThreshold: 3,
      images: [
        { id: 'img-002-1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-002-2', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Élégant', 'Soirée', 'Tendance'],
      sku: 'ROB-SOI-002',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-18')
    },
    {
      id: 'prod-003',
      boutiqueId: 'bout-002',
      boutiqueName: 'Tech & Gadgets',
      boutiqueSlug: 'tech-gadgets',
      categoryId: 'cat-electronique',
      name: 'Écouteurs Sans Fil Pro',
      slug: 'ecouteurs-sans-fil-pro',
      description: 'Écouteurs Bluetooth avec réduction de bruit active. Autonomie de 30 heures. Son haute fidélité et microphones intégrés pour des appels cristallins.',
      shortDescription: 'Écouteurs Bluetooth premium',
      price: 320000,
      compareAtPrice: 400000,
      stock: 45,
      lowStockThreshold: 10,
      images: [
        { id: 'img-003-1', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-003-2', url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Tech', 'Audio', 'Sans fil'],
      sku: 'ECO-PRO-003',
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-22')
    },
    {
      id: 'prod-004',
      boutiqueId: 'bout-002',
      boutiqueName: 'Tech & Gadgets',
      boutiqueSlug: 'tech-gadgets',
      categoryId: 'cat-electronique',
      name: 'Montre Connectée Sport',
      slug: 'montre-connectee-sport',
      description: 'Montre connectée avec GPS intégré, cardiofréquencemètre et plus de 100 modes sportifs. Résistante à l\'eau jusqu\'à 50m. Écran AMOLED lumineux.',
      shortDescription: 'Montre connectée multisport',
      price: 450000,
      stock: 18,
      lowStockThreshold: 5,
      images: [
        { id: 'img-004-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-004-2', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Sport', 'Connecté', 'GPS'],
      sku: 'MON-SPT-004',
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-19')
    },
    {
      id: 'prod-005',
      boutiqueId: 'bout-003',
      boutiqueName: 'Beauté & Soins',
      boutiqueSlug: 'beaute-soins',
      categoryId: 'cat-beaute',
      name: 'Coffret Soins Visage',
      slug: 'coffret-soins-visage',
      description: 'Coffret complet de soins pour le visage comprenant nettoyant, sérum, crème de jour et masque. Produits naturels et biologiques pour une peau éclatante.',
      shortDescription: 'Coffret complet soins visage',
      price: 175000,
      compareAtPrice: 220000,
      stock: 30,
      lowStockThreshold: 8,
      images: [
        { id: 'img-005-1', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-005-2', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Bio', 'Soins', 'Coffret'],
      sku: 'COF-SOI-005',
      createdAt: new Date('2025-01-12'),
      updatedAt: new Date('2025-01-21')
    },
    {
      id: 'prod-006',
      boutiqueId: 'bout-003',
      boutiqueName: 'Beauté & Soins',
      boutiqueSlug: 'beaute-soins',
      categoryId: 'cat-beaute',
      name: 'Parfum Eau de Rose',
      slug: 'parfum-eau-de-rose',
      description: 'Parfum délicat aux notes de rose, jasmin et musc. Fragrance longue durée idéale pour le quotidien. Flacon élégant de 100ml.',
      shortDescription: 'Parfum floral délicat',
      price: 125000,
      stock: 40,
      lowStockThreshold: 10,
      images: [
        { id: 'img-006-1', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-006-2', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Parfum', 'Rose', 'Femme'],
      sku: 'PAR-ROS-006',
      createdAt: new Date('2025-01-14'),
      updatedAt: new Date('2025-01-20')
    },
    {
      id: 'prod-007',
      boutiqueId: 'bout-004',
      boutiqueName: 'Maison & Déco',
      boutiqueSlug: 'maison-deco',
      categoryId: 'cat-maison',
      name: 'Lampe de Table Design',
      slug: 'lampe-de-table-design',
      description: 'Lampe de table au design moderne et épuré. Lumière LED ajustable avec 3 intensités. Base en bois massif et abat-jour en tissu beige.',
      shortDescription: 'Lampe design LED ajustable',
      price: 89000,
      compareAtPrice: 110000,
      stock: 22,
      lowStockThreshold: 5,
      images: [
        { id: 'img-007-1', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-007-2', url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Design', 'LED', 'Bois'],
      sku: 'LAM-DES-007',
      createdAt: new Date('2025-01-09'),
      updatedAt: new Date('2025-01-17')
    },
    {
      id: 'prod-008',
      boutiqueId: 'bout-004',
      boutiqueName: 'Maison & Déco',
      boutiqueSlug: 'maison-deco',
      categoryId: 'cat-maison',
      name: 'Coussin Velours Premium',
      slug: 'coussin-velours-premium',
      description: 'Coussin décoratif en velours premium 45x45cm. Housse amovible et lavable. Rembourrage moelleux pour un confort optimal.',
      shortDescription: 'Coussin velours 45x45cm',
      price: 45000,
      stock: 60,
      lowStockThreshold: 15,
      images: [
        { id: 'img-008-1', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-008-2', url: 'https://images.unsplash.com/photo-1629949009765-4eb151cf3d7e?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Velours', 'Déco', 'Confort'],
      sku: 'COU-VEL-008',
      createdAt: new Date('2025-01-11'),
      updatedAt: new Date('2025-01-16')
    },
    {
      id: 'prod-009',
      boutiqueId: 'bout-001',
      boutiqueName: 'Mode Élégance',
      boutiqueSlug: 'mode-elegance',
      categoryId: 'cat-accessoires',
      name: 'Sac à Main Cuir Marron',
      slug: 'sac-main-cuir-marron',
      description: 'Sac à main en cuir véritable, coloris marron cognac. Design intemporel avec plusieurs compartiments. Bandoulière ajustable incluse.',
      shortDescription: 'Sac en cuir véritable',
      price: 280000,
      compareAtPrice: 350000,
      stock: 8,
      lowStockThreshold: 3,
      images: [
        { id: 'img-009-1', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-009-2', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Cuir', 'Accessoire', 'Luxe'],
      sku: 'SAC-CUI-009',
      createdAt: new Date('2025-01-07'),
      updatedAt: new Date('2025-01-23')
    },
    {
      id: 'prod-010',
      boutiqueId: 'bout-002',
      boutiqueName: 'Tech & Gadgets',
      boutiqueSlug: 'tech-gadgets',
      categoryId: 'cat-electronique',
      name: 'Enceinte Portable Bluetooth',
      slug: 'enceinte-portable-bluetooth',
      description: 'Enceinte Bluetooth portable avec son 360°. Étanche IPX7, autonomie 20h. Parfaite pour vos sorties et aventures.',
      shortDescription: 'Enceinte portable étanche',
      price: 185000,
      stock: 35,
      lowStockThreshold: 8,
      images: [
        { id: 'img-010-1', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-010-2', url: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Audio', 'Portable', 'Étanche'],
      sku: 'ENC-BLT-010',
      createdAt: new Date('2025-01-13'),
      updatedAt: new Date('2025-01-22')
    },
    {
      id: 'prod-011',
      boutiqueId: 'bout-005',
      boutiqueName: 'Sports & Loisirs',
      boutiqueSlug: 'sports-loisirs',
      categoryId: 'cat-sport',
      name: 'Tapis de Yoga Premium',
      slug: 'tapis-yoga-premium',
      description: 'Tapis de yoga antidérapant 183x61cm, épaisseur 6mm. Matériau écologique et hypoallergénique. Sac de transport inclus.',
      shortDescription: 'Tapis yoga antidérapant',
      price: 65000,
      compareAtPrice: 85000,
      stock: 50,
      lowStockThreshold: 12,
      images: [
        { id: 'img-011-1', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-011-2', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Yoga', 'Sport', 'Éco'],
      sku: 'TAP-YOG-011',
      createdAt: new Date('2025-01-06'),
      updatedAt: new Date('2025-01-18')
    },
    {
      id: 'prod-012',
      boutiqueId: 'bout-005',
      boutiqueName: 'Sports & Loisirs',
      boutiqueSlug: 'sports-loisirs',
      categoryId: 'cat-sport',
      name: 'Haltères Réglables Set',
      slug: 'halteres-reglables-set',
      description: 'Set d\'haltères réglables de 2 à 20kg chacun. Mécanisme de verrouillage sécurisé. Gain de place idéal pour l\'entraînement à domicile.',
      shortDescription: 'Haltères ajustables 2-20kg',
      price: 380000,
      stock: 15,
      lowStockThreshold: 4,
      images: [
        { id: 'img-012-1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-012-2', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Musculation', 'Fitness', 'Home Gym'],
      sku: 'HAL-REG-012',
      createdAt: new Date('2025-01-04'),
      updatedAt: new Date('2025-01-21')
    },
    {
      id: 'prod-013',
      boutiqueId: 'bout-006',
      boutiqueName: 'Livres & Culture',
      boutiqueSlug: 'livres-culture',
      categoryId: 'cat-livres',
      name: 'Collection Romans Classiques',
      slug: 'collection-romans-classiques',
      description: 'Collection de 5 romans classiques de la littérature française. Édition reliée avec couverture rigide. Papier de qualité supérieure.',
      shortDescription: 'Collection 5 romans classiques',
      price: 95000,
      compareAtPrice: 125000,
      stock: 20,
      lowStockThreshold: 5,
      images: [
        { id: 'img-013-1', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-013-2', url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Livres', 'Classiques', 'Collection'],
      sku: 'COL-ROM-013',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-17')
    },
    {
      id: 'prod-014',
      boutiqueId: 'bout-003',
      boutiqueName: 'Beauté & Soins',
      boutiqueSlug: 'beaute-soins',
      categoryId: 'cat-beaute',
      name: 'Palette Maquillage Pro',
      slug: 'palette-maquillage-pro',
      description: 'Palette professionnelle de 24 teintes d\'ombres à paupières. Fini mat, satiné et métallique. Pigmentation intense et longue tenue.',
      shortDescription: 'Palette 24 teintes pro',
      price: 78000,
      stock: 55,
      lowStockThreshold: 15,
      images: [
        { id: 'img-014-1', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-014-2', url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: true,
      tags: ['Maquillage', 'Pro', 'Palette'],
      sku: 'PAL-MAQ-014',
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-19')
    },
    {
      id: 'prod-015',
      boutiqueId: 'bout-004',
      boutiqueName: 'Maison & Déco',
      boutiqueSlug: 'maison-deco',
      categoryId: 'cat-maison',
      name: 'Miroir Mural Doré',
      slug: 'miroir-mural-dore',
      description: 'Miroir mural rond avec cadre doré style Art Déco. Diamètre 60cm. Fixation murale incluse. Parfait pour illuminer votre intérieur.',
      shortDescription: 'Miroir rond cadre doré 60cm',
      price: 145000,
      stock: 12,
      lowStockThreshold: 3,
      images: [
        { id: 'img-015-1', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-015-2', url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'active',
      isFeatured: false,
      tags: ['Miroir', 'Doré', 'Art Déco'],
      sku: 'MIR-DOR-015',
      createdAt: new Date('2025-01-11'),
      updatedAt: new Date('2025-01-20')
    },
    {
      id: 'prod-016',
      boutiqueId: 'bout-001',
      boutiqueName: 'Mode Élégance',
      boutiqueSlug: 'mode-elegance',
      categoryId: 'cat-vetements',
      name: 'Pull Cachemire Col V',
      slug: 'pull-cachemire-col-v',
      description: 'Pull en pur cachemire, col V élégant. Douceur incomparable et chaleur naturelle. Coloris gris chiné intemporel.',
      shortDescription: 'Pull 100% cachemire',
      price: 220000,
      compareAtPrice: 280000,
      stock: 0,
      lowStockThreshold: 5,
      images: [
        { id: 'img-016-1', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop', position: 0, isPrimary: true },
        { id: 'img-016-2', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop', position: 1, isPrimary: false }
      ],
      status: 'out_of_stock',
      isFeatured: false,
      tags: ['Cachemire', 'Luxe', 'Hiver'],
      sku: 'PUL-CAS-016',
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-15')
    }
  ];

  // Categories for filtering
  readonly categories = signal([
    { id: 'cat-vetements', name: 'Vêtements', slug: 'vetements' },
    { id: 'cat-electronique', name: 'Électronique', slug: 'electronique' },
    { id: 'cat-beaute', name: 'Beauté & Soins', slug: 'beaute' },
    { id: 'cat-maison', name: 'Maison & Déco', slug: 'maison' },
    { id: 'cat-sport', name: 'Sports & Loisirs', slug: 'sport' },
    { id: 'cat-accessoires', name: 'Accessoires', slug: 'accessoires' },
    { id: 'cat-livres', name: 'Livres & Culture', slug: 'livres' }
  ]);

  // Price ranges for filtering
  readonly priceRanges = [
    { label: 'Moins de 50 000 Ar', min: 0, max: 50000 },
    { label: '50 000 - 100 000 Ar', min: 50000, max: 100000 },
    { label: '100 000 - 200 000 Ar', min: 100000, max: 200000 },
    { label: '200 000 - 500 000 Ar', min: 200000, max: 500000 },
    { label: 'Plus de 500 000 Ar', min: 500000, max: Infinity }
  ];

  // Get all products
  getAllProducts(): ProductWithBoutique[] {
    return [...this.mockProducts];
  }

  // Get products with filtering and pagination
  getProducts(filter: ProductFilter = {}): Observable<PaginatedProducts & { items: ProductWithBoutique[] }> {
    let filtered = [...this.mockProducts];

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.toLowerCase().includes(searchLower)) ||
        p.boutiqueName.toLowerCase().includes(searchLower)
      );
    }

    if (filter.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filter.categoryId);
    }

    if (filter.boutiqueId) {
      filtered = filtered.filter(p => p.boutiqueId === filter.boutiqueId);
    }

    if (filter.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (filter.tags?.length) {
      filtered = filtered.filter(p =>
        filter.tags!.some(t => p.tags.includes(t))
      );
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return of({
      items: paginatedItems,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }).pipe(delay(300)); // Simulate network delay
  }

  // Get single product by boutique slug and product slug
  getProductBySlug(boutiqueSlug: string, productSlug: string): Observable<ProductWithBoutique | null> {
    const product = this.mockProducts.find(
      p => p.boutiqueSlug === boutiqueSlug && p.slug === productSlug
    );
    return of(product || null).pipe(delay(200));
  }

  // Get product by ID
  getProductById(id: string): Observable<ProductWithBoutique | null> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product || null).pipe(delay(200));
  }

  // Get featured products
  getFeaturedProducts(limit: number = 8): Observable<ProductWithBoutique[]> {
    const featured = this.mockProducts
      .filter(p => p.isFeatured && p.status === 'active')
      .slice(0, limit);
    return of(featured).pipe(delay(200));
  }

  // Get products by boutique
  getProductsByBoutique(boutiqueSlug: string): Observable<ProductWithBoutique[]> {
    const products = this.mockProducts.filter(p => p.boutiqueSlug === boutiqueSlug);
    return of(products).pipe(delay(200));
  }

  // Get related products (same category, different product)
  getRelatedProducts(productId: string, limit: number = 4): Observable<ProductWithBoutique[]> {
    const currentProduct = this.mockProducts.find(p => p.id === productId);
    if (!currentProduct) return of([]);

    const related = this.mockProducts
      .filter(p => p.id !== productId && p.categoryId === currentProduct.categoryId && p.status === 'active')
      .slice(0, limit);
    return of(related).pipe(delay(200));
  }

  // Get all unique tags
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.mockProducts.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }
}
