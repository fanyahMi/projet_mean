const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String }, // icon class or url
    type: {
        type: String,
        enum: ['product', 'boutique'],
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
