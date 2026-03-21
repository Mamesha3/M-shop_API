# M-Shop API Deployment Guide

## 🚀 Deployment Status

### ✅ Current Deployment
- **Backend URL**: https://m-shop-api.onrender.com
- **Frontend URL**: https://m-shop-food-delivery.netlify.app
- **Status**: Deployed and Configured

## 📋 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Authentication
- **POST** `/api/users/register` - User registration
- **POST** `/api/users/login` - User login
- **GET** `/api/users/profile` - Get user profile

### Products
- **GET** `/api/products` - Get all products
- **GET** `/api/products/featured` - Get featured products
- **GET** `/api/products/search?q=query` - Search products
- **POST** `/api/products` - Create product (admin)
- **PUT** `/api/products/:id` - Update product (admin)
- **DELETE** `/api/products/:id` - Delete product (admin)

### Ratings
- **POST** `/api/ratings` - Add/update rating (protected)
- **GET** `/api/ratings/product/:id` - Get product ratings
- **GET** `/api/ratings/user/:id` - Get user's rating (protected)
- **DELETE** `/api/ratings/:id` - Delete rating (protected)

### Orders
- **POST** `/api/orders` - Create order
- **GET** `/api/orders/user` - Get user orders
- **GET** `/api/orders` - Get all orders (admin)

### Payments
- **POST** `/api/payments/create-payment-intent` - Create Stripe payment

### Admin
- **GET** `/api/admin/stats` - Get dashboard stats
- **GET** `/api/admin/users` - Get all users
- **GET** `/api/admin/orders` - Get all orders

## 🔧 Configuration

### CORS Settings
```javascript
origin: [
  'http://localhost:5173',
  'https://m-shop-food-delivery.netlify.app'
]
```

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLIENT_URL` - Frontend URL
- `CLOUDINARY_*` - Cloudinary settings
- `Stripe_*` - Stripe payment keys

## 🧪 Testing

### Test Health Endpoint
```bash
curl https://m-shop-api.onrender.com/health
```

### Test Products Endpoint
```bash
curl https://m-shop-api.onrender.com/api/products
```

## 📱 Frontend Integration

The frontend is configured to connect to:
```
https://m-shop-api.onrender.com
```

All API calls from the frontend will work with proper CORS configuration.

## 🔄 Auto-Deployment

- **Git Push** → **Render Auto-Deploy** → **Live Update**
- Any changes pushed to GitHub will automatically deploy
- Deployment typically takes 2-3 minutes

## 🚨 Troubleshooting

### If API is not responding:
1. Check Render dashboard for deployment status
2. Verify environment variables are set
3. Check health endpoint: `/health`

### If CORS errors:
1. Verify frontend URL is in CORS origin array
2. Check if frontend URL is correct (no trailing slash)

### If database connection fails:
1. Verify MongoDB URI is correct
2. Check if MongoDB cluster is running

## 🎯 Next Steps

1. ✅ Backend deployed to Render
2. ✅ Frontend deployed to Netlify  
3. ✅ CORS configured properly
4. ✅ Health check endpoint added
5. ✅ Auto-deployment setup complete

Your M-Shop API is fully deployed and integrated! 🎉
