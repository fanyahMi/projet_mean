const express = require('express');
const router = express.Router();

const {
    getAllBoutiques,
    createBoutique,
    getBoutiqueById,
    updateBoutique,
    deleteBoutique
} = require('../controllers/boutique.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/boutiques:
 *   get:
 *     summary: Lister toutes les boutiques
 *     description: Retourne la liste complète des boutiques du centre commercial avec les informations de leur propriétaire.
 *     tags: [Boutiques]
 *     responses:
 *       200:
 *         description: Liste des boutiques récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Boutique'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/', getAllBoutiques);

/**
 * @swagger
 * /api/boutiques:
 *   post:
 *     summary: Créer une nouvelle boutique
 *     description: Crée une nouvelle boutique dans le centre commercial. Le statut initial est `pending` en attendant la validation par un administrateur. Réservé aux rôles `boutique` et `admin`.
 *     tags: [Boutiques]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoutiqueRequest'
 *           example:
 *             name: "Mode Élégance"
 *             description: "Boutique de vêtements modernes et élégants pour femmes et hommes"
 *             contactEmail: "contact@mode-elegance.mg"
 *             contactPhone: "+261 34 11 222 33"
 *             categoryId: "cat-vetements"
 *     responses:
 *       201:
 *         description: Boutique créée avec succès (statut en attente de validation)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boutique'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Accès refusé — rôle insuffisant (admin ou boutique requis)
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
router.post('/', protect, authorize('admin', 'boutique'), createBoutique);

/**
 * @swagger
 * /api/boutiques/{id}:
 *   get:
 *     summary: Récupérer une boutique par ID
 *     description: Retourne les détails complets d'une boutique spécifique, incluant les informations du propriétaire.
 *     tags: [Boutiques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB unique de la boutique
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: Boutique trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boutique'
 *       404:
 *         description: Boutique non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *             example:
 *               message: "Boutique not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/:id', getBoutiqueById);

/**
 * @swagger
 * /api/boutiques/{id}:
 *   put:
 *     summary: Modifier une boutique
 *     description: Met à jour les informations d'une boutique. Seul le propriétaire de la boutique ou un admin peut effectuer cette action.
 *     tags: [Boutiques]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB unique de la boutique
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c86"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoutiqueUpdateRequest'
 *           example:
 *             name: "Mode Élégance Premium"
 *             description: "Nouvelle description mise à jour"
 *             contactEmail: "nouveau@mode-elegance.mg"
 *     responses:
 *       200:
 *         description: Boutique mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boutique'
 *       401:
 *         description: Non authentifié ou non autorisé (pas le propriétaire)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *             example:
 *               message: "Not authorized"
 *       403:
 *         description: Rôle insuffisant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Boutique non trouvée
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
router.put('/:id', protect, authorize('admin', 'boutique'), updateBoutique);

/**
 * @swagger
 * /api/boutiques/{id}:
 *   delete:
 *     summary: Supprimer une boutique
 *     description: Supprime définitivement une boutique du système. Action réservée exclusivement aux administrateurs.
 *     tags: [Boutiques]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB unique de la boutique à supprimer
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: Boutique supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Boutique removed"
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Accès refusé — rôle admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Boutique non trouvée
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
router.delete('/:id', protect, authorize('admin'), deleteBoutique);

module.exports = router;
