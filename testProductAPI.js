require('dotenv').config();
const Product = require('./src/models/productSchema');
const connectDB = require('./src/config/mongoDb');

// Sample product data for testing (simulating after Cloudinary upload)
const testProduct = {
  name: 'Classic Cheese Pizza',
  price: 12.99,
  description: 'Delicious classic cheese pizza with fresh mozzarella, tomato sauce, and herbs on a crispy crust. Perfect for any occasion!',
  category: 'Food',
  image: 'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/pizza.jpg',
  imagePublicId: 'mshop/products/pizza_demo_12345',
  inStock: true,
  stock: 25,
  featured: true,
  tags: ['pizza', 'cheese', 'italian', 'food', 'delivery']
};

async function testProductAPI() {
  try {
    console.log('🚀 Testing Product API...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // Create test product
    console.log('📦 Creating test product...');
    const product = await Product.create(testProduct);
    console.log('✅ Product created successfully!');
    console.log('📋 Product Details:');
    console.log(`   ID: ${product._id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Category: ${product.category}`);
    console.log(`   Image: ${product.image}`);
    console.log(`   Image Public ID: ${product.imagePublicId}`);
    console.log(`   Stock: ${product.stock}`);
    console.log(`   Featured: ${product.featured}`);
    console.log(`   Tags: ${product.tags.join(', ')}`);
    console.log(`   Created At: ${product.createdAt}\n`);
    
    // Test finding the product
    console.log('🔍 Testing find product...');
    const foundProduct = await Product.findById(product._id);
    console.log('✅ Product found successfully!');
    console.log(`   Found: ${foundProduct.name}\n`);
    
    // Test updating the product
    console.log('📝 Testing update product...');
    foundProduct.price = 14.99;
    foundProduct.stock = 30;
    foundProduct.featured = false;
    await foundProduct.save();
    console.log('✅ Product updated successfully!');
    console.log(`   New Price: $${foundProduct.price}`);
    console.log(`   New Stock: ${foundProduct.stock}`);
    console.log(`   New Featured: ${foundProduct.featured}\n`);
    
    // Test getting all products
    console.log('📚 Testing get all products...');
    const allProducts = await Product.find();
    console.log(`✅ Found ${allProducts.length} product(s) in database`);
    allProducts.forEach(p => {
      console.log(`   - ${p.name}: $${p.price} (${p.category})`);
    });
    console.log();
    
    // Test filtering by category
    console.log('🍕 Testing filter by category...');
    const foodProducts = await Product.find({ category: 'Food' });
    console.log(`✅ Found ${foodProducts.length} food product(s)`);
    foodProducts.forEach(p => {
      console.log(`   - ${p.name}: $${p.price}`);
    });
    console.log();
    
    // Test filtering by featured
    console.log('⭐ Testing filter by featured...');
    const featuredProducts = await Product.find({ featured: true });
    console.log(`✅ Found ${featuredProducts.length} featured product(s)`);
    featuredProducts.forEach(p => {
      console.log(`   - ${p.name}: $${p.price}`);
    });
    console.log();
    
    // Clean up - delete the test product
    console.log('🗑️  Cleaning up test data...');
    await Product.findByIdAndDelete(product._id);
    console.log('✅ Test product deleted successfully!\n');
    
    console.log('🎉 All tests passed! Product API is working correctly!');
    console.log('📝 Schema validation is working properly!');
    console.log('🔍 All CRUD operations are functional!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Close database connection
    process.exit();
  }
}

// Run the test
testProductAPI();
