const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '🏬 Mall Management API',
            version: '1.0.0',
            description: `
## API de Gestion de Centre Commercial

Cette API RESTful permet de gérer toutes les ressources d'un centre commercial :
boutiques, produits, utilisateurs et commandes.

### Authentification
La plupart des routes protégées nécessitent un **Bearer Token JWT**.
Après login ou register, récupérez le \`token\` et ajoutez-le dans l'en-tête :
\`\`\`
Authorization: Bearer <votre_token>
\`\`\`

### Rôles disponibles
| Rôle | Description |
|------|-------------|
| \`admin\` | Accès complet à toutes les ressources |
| \`boutique\` | Gestion de sa propre boutique et ses produits |
| \`acheteur\` | Consultation des boutiques et produits, passer des commandes |
            `,
            contact: {
                name: 'Mall Management API Team',
                email: 'support@mall-management.mg'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Serveur de développement local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenu après connexion via /api/auth/login'
                }
            },
            schemas: {
                // -------- AUTH SCHEMAS --------
                RegisterRequest: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password'],
                    properties: {
                        firstName: { type: 'string', example: 'Jean', description: 'Prénom de l\'utilisateur' },
                        lastName: { type: 'string', example: 'Dupont', description: 'Nom de l\'utilisateur' },
                        email: { type: 'string', format: 'email', example: 'jean.dupont@mail.com' },
                        password: { type: 'string', format: 'password', minLength: 6, example: 'motdepasse123' },
                        role: { type: 'string', enum: ['admin', 'boutique', 'acheteur'], default: 'acheteur', example: 'acheteur' },
                        phone: { type: 'string', example: '+261 34 00 000 00' }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'jean.dupont@mail.com' },
                        password: { type: 'string', format: 'password', example: 'motdepasse123' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
                                firstName: { type: 'string', example: 'Jean' },
                                lastName: { type: 'string', example: 'Dupont' },
                                email: { type: 'string', example: 'jean.dupont@mail.com' },
                                role: { type: 'string', example: 'acheteur' }
                            }
                        }
                    }
                },
                UserProfile: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
                        firstName: { type: 'string', example: 'Jean' },
                        lastName: { type: 'string', example: 'Dupont' },
                        email: { type: 'string', format: 'email', example: 'jean.dupont@mail.com' },
                        role: { type: 'string', enum: ['admin', 'boutique', 'acheteur'], example: 'acheteur' },
                        phone: { type: 'string', example: '+261 34 00 000 00' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },

                // -------- BOUTIQUE SCHEMAS --------
                BoutiqueRequest: {
                    type: 'object',
                    required: ['name', 'description', 'contactEmail'],
                    properties: {
                        name: { type: 'string', example: 'Mode Élégance', description: 'Nom de la boutique' },
                        description: { type: 'string', example: 'Boutique de vêtements modernes et élégants' },
                        contactEmail: { type: 'string', format: 'email', example: 'contact@mode-elegance.mg' },
                        contactPhone: { type: 'string', example: '+261 34 11 222 33' },
                        categoryId: { type: 'string', example: 'cat-vetements', description: 'ID de la catégorie' }
                    }
                },
                BoutiqueUpdateRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Mode Élégance Plus' },
                        description: { type: 'string', example: 'Nouvelle description' },
                        contactEmail: { type: 'string', format: 'email', example: 'nouveau@mail.com' },
                        contactPhone: { type: 'string', example: '+261 34 99 888 77' }
                    }
                },
                Boutique: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d21b4667d0d8992e610c86' },
                        name: { type: 'string', example: 'Mode Élégance' },
                        slug: { type: 'string', example: 'mode-elegance' },
                        description: { type: 'string', example: 'Boutique de vêtements modernes' },
                        contactEmail: { type: 'string', example: 'contact@mode-elegance.mg' },
                        contactPhone: { type: 'string', example: '+261 34 11 222 33' },
                        status: { type: 'string', enum: ['pending', 'active', 'suspended'], example: 'pending' },
                        categoryId: { type: 'string', example: 'cat-vetements' },
                        owner: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                firstName: { type: 'string', example: 'Jean' },
                                lastName: { type: 'string', example: 'Dupont' },
                                email: { type: 'string', example: 'jean.dupont@mail.com' }
                            }
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },

                // -------- PRODUCT SCHEMAS --------
                ProductRequest: {
                    type: 'object',
                    required: ['name', 'price', 'stock', 'boutique'],
                    properties: {
                        name: { type: 'string', example: 'Chemise Lin Premium' },
                        description: { type: 'string', example: 'Chemise en lin de haute qualité' },
                        price: { type: 'number', format: 'float', example: 85000 },
                        compareAtPrice: { type: 'number', format: 'float', example: 120000, description: 'Prix barré (prix avant promo)' },
                        stock: { type: 'integer', example: 25 },
                        sku: { type: 'string', example: 'CHM-LIN-001' },
                        boutique: { type: 'string', example: '60d21b4667d0d8992e610c86', description: 'ID de la boutique parente' },
                        category: { type: 'string', example: '60d21b4667d0d8992e610c87', description: 'ID de la catégorie' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['Nouveau', 'Lin', 'Été'] },
                        isFeatured: { type: 'boolean', example: false },
                        status: { type: 'string', enum: ['draft', 'active', 'out_of_stock', 'discontinued'], example: 'active' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d21b4667d0d8992e610c88' },
                        name: { type: 'string', example: 'Chemise Lin Premium' },
                        slug: { type: 'string', example: 'chemise-lin-premium' },
                        description: { type: 'string', example: 'Chemise en lin de haute qualité' },
                        price: { type: 'number', example: 85000 },
                        compareAtPrice: { type: 'number', example: 120000 },
                        stock: { type: 'integer', example: 25 },
                        sku: { type: 'string', example: 'CHM-LIN-001' },
                        status: { type: 'string', enum: ['draft', 'active', 'out_of_stock', 'discontinued'], example: 'active' },
                        isFeatured: { type: 'boolean', example: false },
                        tags: { type: 'array', items: { type: 'string' }, example: ['Nouveau', 'Lin'] },
                        images: { type: 'array', items: { type: 'string' }, example: ['https://example.com/image.jpg'] },
                        boutique: { type: 'string', example: '60d21b4667d0d8992e610c86' },
                        category: { type: 'string', example: '60d21b4667d0d8992e610c87' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                ProductListResponse: {
                    type: 'object',
                    properties: {
                        products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                        page: { type: 'integer', example: 1 },
                        pages: { type: 'integer', example: 5 },
                        total: { type: 'integer', example: 48 }
                    }
                },

                // -------- ERROR SCHEMAS --------
                Error400: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Données invalides ou manquantes' }
                    }
                },
                Error401: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Non authentifié, token manquant ou invalide' }
                    }
                },
                Error403: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Accès interdit, rôle insuffisant' }
                    }
                },
                Error404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Ressource non trouvée' }
                    }
                },
                Error500: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Erreur interne du serveur' }
                    }
                }
            }
        },
        tags: [
            { name: 'Auth', description: '🔐 Authentification et gestion des comptes' },
            { name: 'Boutiques', description: '🏪 Gestion des boutiques du centre commercial' },
            { name: 'Products', description: '📦 Gestion des produits' }
        ]
    },
    apis: ['./src/routes/*.js']  // Fichiers contenant les annotations JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
