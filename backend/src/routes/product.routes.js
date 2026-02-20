const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lister tous les produits
 *     description: |
 *       Retourne la liste paginée de tous les produits disponibles dans le centre commercial.
 *
 *       **Paramètres de filtre disponibles :**
 *       - `keyword` : recherche textuelle dans le nom et la description
 *       - `category` : filtre par ID de catégorie
 *       - `page` : numéro de la page (défaut: 1)
 *       - `limit` : nombre de résultats par page (défaut: 12)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Mot-clé pour rechercher dans nom et description
 *         example: "chemise"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par ID de catégorie
 *         example: "60d21b4667d0d8992e610c87"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre de produits par page
 *     responses:
 *       200:
 *         description: Liste paginée des produits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             example:
 *               products: []
 *               page: 1
 *               pages: 1
 *               total: 0
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Crée un nouveau produit rattaché à une boutique. Réservé aux propriétaires de boutique et aux administrateurs.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *           example:
 *             name: "Chemise Lin Premium"
 *             description: "Chemise en lin de haute qualité, parfaite pour les journées chaudes."
 *             price: 85000
 *             compareAtPrice: 120000
 *             stock: 25
 *             sku: "CHM-LIN-001"
 *             boutique: "60d21b4667d0d8992e610c86"
 *             category: "60d21b4667d0d8992e610c87"
 *             tags: ["Nouveau", "Lin", "Été"]
 *             isFeatured: false
 *             status: "active"
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Accès refusé — rôle admin ou boutique requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/', protect, authorize('admin', 'boutique'), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     description: Retourne les détails complets d'un produit spécifique incluant ses informations de boutique et catégorie.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB unique du produit
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c88"
 *     responses:
 *       200:
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *             example:
 *               message: "Product not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     description: Supprime définitivement un produit. Réservé au propriétaire de la boutique parente ou à un administrateur.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB unique du produit à supprimer
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c88"
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product removed"
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Accès refusé — rôle admin ou boutique requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Produit non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete('/:id', protect, authorize('admin', 'boutique'), deleteProduct);

module.exports = router;
