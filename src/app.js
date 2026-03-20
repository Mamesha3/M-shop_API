const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const ratingRoutes = require('./routes/rating');

const app = express();

// Middleware
// Increase payload size limit for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);

module.exports = app;