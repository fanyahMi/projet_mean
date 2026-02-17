const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .populate('boutique', 'name slug')
            .populate('category', 'name slug')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('boutique', 'name slug')
            .populate('category', 'name slug');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Boutique Owner/Admin)
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, categoryId, boutiqueId, stock, images } = req.body;

        const product = new Product({
            name,
            slug: name.toLowerCase().replace(/ /g, '-'),
            price,
            description,
            category: categoryId,
            boutique: boutiqueId, // Should verify if user owns this boutique
            stock,
            images,
            user: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Owner/Admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
