const mongoose = require('mongoose');
const Product = require('./src/models/productSchema.js');
require('dotenv').config();

const foodProducts = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/burger123/400/300.jpg',
    imagePublicId: 'burger_001',
    inStock: true,
    stock: 20,
    featured: true,
    tags: ['burger', 'fast food', 'beef']
  },
  {
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce on crispy dough',
    price: 15.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/pizza456/400/300.jpg',
    imagePublicId: 'pizza_001',
    inStock: true,
    stock: 15,
    featured: true,
    tags: ['pizza', 'italian', 'cheese']
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan cheese and croutons',
    price: 8.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/salad789/400/300.jpg',
    imagePublicId: 'salad_001',
    inStock: true,
    stock: 25,
    featured: false,
    tags: ['salad', 'healthy', 'vegetarian']
  },
  {
    name: 'Sushi Roll',
    description: 'Fresh salmon and avocado wrapped in seasoned seaweed',
    price: 18.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/sushi012/400/300.jpg',
    imagePublicId: 'sushi_001',
    inStock: true,
    stock: 10,
    featured: true,
    tags: ['sushi', 'japanese', 'fish']
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate layers with creamy frosting',
    price: 6.99,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/cake345/400/300.jpg',
    imagePublicId: 'cake_001',
    inStock: true,
    stock: 30,
    featured: false,
    tags: ['cake', 'dessert', 'chocolate']
  },
  {
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken with herbs and spices',
    price: 14.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/chicken678/400/300.jpg',
    imagePublicId: 'chicken_001',
    inStock: true,
    stock: 18,
    featured: false,
    tags: ['chicken', 'grilled', 'protein']
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon and parmesan cheese',
    price: 13.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/pasta901/400/300.jpg',
    imagePublicId: 'pasta_001',
    inStock: true,
    stock: 12,
    featured: false,
    tags: ['pasta', 'italian', 'cream']
  },
  {
    name: 'Fish Tacos',
    description: 'Crispy fish with cabbage slaw and chipotle mayo',
    price: 11.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/tacos234/400/300.jpg',
    imagePublicId: 'tacos_001',
    inStock: true,
    stock: 16,
    featured: false,
    tags: ['tacos', 'mexican', 'fish']
  },
  {
    name: 'Vegetable Stir Fry',
    description: 'Fresh vegetables stir-fried with ginger and garlic',
    price: 10.99,
    category: 'Food',
    image: 'https://picsum.photos/seed/stirfry567/400/300.jpg',
    imagePublicId: 'stirfry_001',
    inStock: true,
    stock: 22,
    featured: false,
    tags: ['vegetables', 'healthy', 'asian']
  }
];

async function seedFoodProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mshop');
    
    console.log('Connected to MongoDB for seeding food products');
    
    // Clear existing food products (optional - remove if you want to keep existing products)
    await Product.deleteMany({ category: { $in: ['Food', 'Desserts'] } });
    console.log('Cleared existing food products');
    
    // Insert food products
    const insertedProducts = await Product.insertMany(foodProducts);
    console.log(`Inserted ${insertedProducts.length} food products`);
    
    // Display inserted products
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding food products:', error);
    process.exit(1);
  }
}

seedFoodProducts();
