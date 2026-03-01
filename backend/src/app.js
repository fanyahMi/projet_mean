const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth.routes');
const boutiqueRoutes = require('./routes/boutique.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const boxRoutes = require('./routes/box.routes');
const categoryRoutes = require('./routes/category.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// -----------------------------------------------
// Security Middleware
// -----------------------------------------------

// Helmet: secure HTTP headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin images
    contentSecurityPolicy: false // Disabled for Swagger UI compatibility
}));

// Compression: gzip responses
app.use(compression());

// Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Log CORS configuration au démarrage
console.log('🔧 CORS Configuration:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - Allowed Origins:', allowedOrigins.length > 0 ? allowedOrigins : '(all origins allowed)');

const corsOptions = {
    origin: (origin, callback) => {
        // Log toutes les requêtes pour déboguer
        console.log(`🌐 CORS Request - Origin: ${origin || 'no origin'}`);
        
        // Allow non-browser clients (no origin) - Postman, curl, etc.
        if (!origin) {
            console.log('✅ CORS: Allowing request without origin (non-browser client)');
            return callback(null, true);
        }
        
        // En développement, autoriser toutes les origines pour faciliter le debug
        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ CORS: Allowing origin (development mode):', origin);
            return callback(null, true);
        }
        
        // En production : si CORS_ORIGIN n'est pas configuré, autoriser toutes les origines (avec warning)
        if (allowedOrigins.length === 0) {
            console.warn('⚠️  CORS: CORS_ORIGIN not configured in production! Allowing all origins (not recommended)');
            return callback(null, true);
        }
        
        // Vérifier si l'origine est autorisée
        if (allowedOrigins.includes(origin)) {
            console.log('✅ CORS: Allowing origin:', origin);
            return callback(null, true);
        }
        
        console.error('❌ CORS: Blocked origin:', origin);
        console.error('   Allowed origins:', allowedOrigins);
        return callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));

// Logging (skip in test/production-quiet mode)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// -----------------------------------------------
// Rate Limiting
// -----------------------------------------------

// Global rate limiter: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test' // Skip in test mode
});
app.use('/api/', globalLimiter);

// Strict rate limiter for auth endpoints (brute force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // 15 attempts per 15 min
    message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test'
});

// -----------------------------------------------
// Health Check Endpoint
// -----------------------------------------------
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -----------------------------------------------
// Swagger UI — Documentation interactive de l'API
// -----------------------------------------------
const swaggerUiOptions = {
    customSiteTitle: '🏬 m1p13mean-Finaritra-Fanyah API Docs',
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
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true
    }
};

// Swagger désactivé par défaut en production (SWAGGER_ENABLED=true pour l'activer)
const isSwaggerEnabled = process.env.NODE_ENV !== 'production'
    ? process.env.SWAGGER_ENABLED !== 'false'       // Dev: enabled unless explicitly false
    : process.env.SWAGGER_ENABLED === 'true';        // Prod: disabled unless explicitly true

if (isSwaggerEnabled) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
}

app.get('/api/docs.json', (req, res) => {
    if (!isSwaggerEnabled) {
        return res.status(404).json({ message: 'API docs are disabled' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// -----------------------------------------------
// Base Route
// -----------------------------------------------
app.get('/', (req, res) => {
    const baseUrl = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;

    res.json({
        message: '🏬 Welcome to m1p13mean-Finaritra-Fanyah API',
        version: '1.0.0',
        documentation: isSwaggerEnabled ? `${baseUrl}/api/docs` : null,
        endpoints: {
            auth: '/api/auth',
            boutiques: '/api/boutiques',
            products: '/api/products',
            orders: '/api/orders',
            boxes: '/api/boxes',
            categories: '/api/categories',
            upload: '/api/upload'
        }
    });
});

// -----------------------------------------------
// API Routes
// -----------------------------------------------
// Apply strict rate limiter to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/boutiques', boutiqueRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// -----------------------------------------------
// Error Handling Middleware
// -----------------------------------------------
app.use((err, req, res, next) => {
    if (err.message && err.message.includes('Not allowed by CORS')) {
        console.error('🚫 CORS Error:', {
            origin: req.headers.origin,
            method: req.method,
            path: req.path,
            message: err.message
        });
        return res.status(403).json({ 
            message: 'CORS Error: Origin not allowed',
            error: err.message,
            allowedOrigins: process.env.NODE_ENV === 'development' ? allowedOrigins : undefined
        });
    }

    console.error('❌ Server Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        origin: req.headers.origin
    });
    
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
