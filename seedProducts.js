const mongoose = require('mongoose');
const Product = require('./src/models/productSchema.js');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Laptop Pro',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce2b02ea?w=300&h=200&fit=crop',
    imagePublicId: 'laptop_pro_001',
    inStock: true,
    stock: 15,
    featured: true,
    tags: ['laptop', 'computer', 'electronics']
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420968-9e4a859774?w=300&h=200&fit=crop',
    imagePublicId: 'headphones_001',
    inStock: true,
    stock: 8,
    featured: false,
    tags: ['headphones', 'wireless', 'audio']
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335421-9b89e0b0177?w=300&h=200&fit=crop',
    imagePublicId: 'smartwatch_001',
    inStock: true,
    stock: 12,
    featured: false,
    tags: ['watch', 'fitness', 'smartwatch']
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for all terrains with enhanced cushioning',
    price: 89.99,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1542291026269-d19f948a4806?w=300&h=200&fit=crop',
    imagePublicId: 'shoes_001',
    inStock: true,
    stock: 25,
    featured: false,
    tags: ['shoes', 'running', 'sports']
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with thermal carafe',
    price: 149.99,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-14954743512-b1b26421e3f?w=300&h=200&fit=crop',
    imagePublicId: 'coffee_maker_001',
    inStock: true,
    stock: 12,
    featured: false,
    tags: ['coffee', 'maker', 'kitchen']
  },
  {
    name: 'T-Shirt',
    description: 'Premium cotton t-shirt with modern fit',
    price: 29.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572166874-191c60f1f1f?w=300&h=200&fit=crop',
    imagePublicId: 'tshirt_001',
    inStock: true,
    stock: 30,
    featured: true,
    tags: ['tshirt', 'clothing', 'fashion']
  },
  {
    name: 'Jeans',
    description: 'Classic fit denim jeans with stretch comfort',
    price: 59.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1541099642191-759acec3b015?w=300&h=200&fit=crop',
    imagePublicId: 'jeans_001',
    inStock: true,
    stock: 20,
    featured: false,
    tags: ['jeans', 'pants', 'clothing']
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mshop');
    
    console.log('Connected to MongoDB for seeding products');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
