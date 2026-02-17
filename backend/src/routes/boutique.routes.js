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

router.get('/', getAllBoutiques);
router.post('/', protect, authorize('admin', 'boutique'), createBoutique);
router.get('/:id', getBoutiqueById);
router.put('/:id', protect, authorize('admin', 'boutique'), updateBoutique);
router.delete('/:id', protect, authorize('admin'), deleteBoutique);

module.exports = router;
