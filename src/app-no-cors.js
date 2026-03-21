const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const ratingRoutes = require('./routes/rating');
const healthRoutes = require('./routes/health');
const rootRoutes = require('./routes/root');

const app = express();

// Middleware
// Increase payload size limit for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// COMPLETELY OPEN CORS - NO RESTRICTIONS
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: '*'
}));

// Additional open headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'false');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Root route
app.use('/', rootRoutes);

// Health check endpoint
app.use('/health', healthRoutes);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);

module.exports = app;
