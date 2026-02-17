const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllProducts);
router.post('/', protect, authorize('admin', 'boutique'), createProduct);
router.get('/:id', getProductById);
router.delete('/:id', protect, authorize('admin', 'boutique'), deleteProduct);

module.exports = router;
