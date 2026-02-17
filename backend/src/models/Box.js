const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "A-101"
    code: { type: String, unique: true, required: true },
    floor: { type: Number, required: true },
    zone: { type: String, required: true }, // e.g., "A", "B", "Food Court"
    area: { type: Number, required: true }, // in square meters
    monthlyRent: { type: Number, required: true },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'maintenance'],
        default: 'available'
    },
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutique',
        default: null
    },
    features: [{ type: String }] // e.g., "Water connection", "Corner unit"
}, { timestamps: true });

module.exports = mongoose.model('Box', boxSchema);
