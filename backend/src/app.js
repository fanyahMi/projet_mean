const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const boutiqueRoutes = require('./routes/boutique.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logger

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mall Management API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/boutiques', boutiqueRoutes);
app.use('/api/products', productRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
