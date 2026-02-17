const Boutique = require('../models/Boutique');

// @desc    Get all boutiques
// @route   GET /api/boutiques
// @access  Public
exports.getAllBoutiques = async (req, res) => {
    try {
        const boutiques = await Boutique.find().populate('owner', 'firstName lastName email');
        res.json(boutiques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single boutique
// @route   GET /api/boutiques/:id
// @access  Public
exports.getBoutiqueById = async (req, res) => {
    try {
        const boutique = await Boutique.findById(req.params.id).populate('owner', 'firstName lastName email');
        if (boutique) {
            res.json(boutique);
        } else {
            res.status(404).json({ message: 'Boutique not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a boutique
// @route   POST /api/boutiques
// @access  Private (Boutique Owner/Admin)
exports.createBoutique = async (req, res) => {
    try {
        const { name, description, contactEmail, contactPhone, categoryId } = req.body;

        const boutique = new Boutique({
            name,
            slug: name.toLowerCase().replace(/ /g, '-'),
            description,
            contactEmail,
            contactPhone,
            categoryId,
            owner: req.user._id,
            status: 'pending'
        });

        const createdBoutique = await boutique.save();
        res.status(201).json(createdBoutique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a boutique
// @route   PUT /api/boutiques/:id
// @access  Private (Owner/Admin)
exports.updateBoutique = async (req, res) => {
    try {
        const { name, description, contactEmail, contactPhone } = req.body;
        const boutique = await Boutique.findById(req.params.id);

        if (boutique) {
            // Check ownership
            if (boutique.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            boutique.name = name || boutique.name;
            boutique.description = description || boutique.description;
            boutique.contactEmail = contactEmail || boutique.contactEmail;
            boutique.contactPhone = contactPhone || boutique.contactPhone;

            const updatedBoutique = await boutique.save();
            res.json(updatedBoutique);
        } else {
            res.status(404).json({ message: 'Boutique not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a boutique
// @route   DELETE /api/boutiques/:id
// @access  Private (Admin)
exports.deleteBoutique = async (req, res) => {
    try {
        const boutique = await Boutique.findById(req.params.id);

        if (boutique) {
            await boutique.deleteOne();
            res.json({ message: 'Boutique removed' });
        } else {
            res.status(404).json({ message: 'Boutique not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
