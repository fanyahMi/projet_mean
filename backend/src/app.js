const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth.routes');
const boutiqueRoutes = require('./routes/boutique.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// -----------------------------------------------
// Swagger UI — Documentation interactive de l'API
// -----------------------------------------------
const swaggerUiOptions = {
    customSiteTitle: '🏬 Mall API Docs',
    customCss: `
        .swagger-ui .topbar { background-color: #1a1a2e; }
        .swagger-ui .topbar a { color: #e94560; }
        .swagger-ui .topbar .download-url-wrapper { display: none; }
        .swagger-ui .info .title { color: #1a1a2e; }
        .swagger-ui .btn.authorize { background-color: #e94560; border-color: #e94560; }
        .swagger-ui .btn.authorize svg { fill: #fff; }
    `,
    customfavIcon: 'https://www.svgrepo.com/show/303264/mongodb-logo.svg',
    swaggerOptions: {
        persistAuthorization: true,   // Le token reste en mémoire après rafraîchissement
        displayRequestDuration: true, // Affiche la durée des requêtes
        docExpansion: 'list',         // Expand les listes par défaut
        filter: true,                 // Barre de recherche des endpoints
        showExtensions: true
    }
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Endpoint JSON brut de la spec OpenAPI (utile pour Postman, Insomnia, etc.)
app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// -----------------------------------------------
// Base Route
// -----------------------------------------------
app.get('/', (req, res) => {
    res.json({
        message: '🏬 Welcome to Mall Management API',
        version: '1.0.0',
        documentation: 'http://localhost:5000/api/docs',
        endpoints: {
            auth: '/api/auth',
            boutiques: '/api/boutiques',
            products: '/api/products'
        }
    });
});

// -----------------------------------------------
// API Routes
// -----------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/boutiques', boutiqueRoutes);
app.use('/api/products', productRoutes);

// -----------------------------------------------
// Error Handling Middleware
// -----------------------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
